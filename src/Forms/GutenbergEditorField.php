<?php

namespace MadeHQ\Gutenberg\Forms;

use SilverStripe\Forms\TextareaField;
use SilverStripe\Control\{HTTPRequest, HTTPResponse_Exception, HTTPResponse};
use SilverStripe\Core\Convert;
use Embed\Embed;
use Embed\Adapters\Webpage;

class GutenbergEditorField extends TextareaField
{
    /**
     * @var array
     */
    private static $allowed_actions = [
        'oembed'
    ];
    /**
     * The default block to render when new block is created.
     *
     * @config
     * @var string
     */
    private static $default_block = 'Text';
    /**
     * {@inheritdoc}
     */
    public function getAttributes()
    {
        return array_merge(parent::getAttributes(), [
            'data-oembed-endpoint' => $this->Link('oembed'),
        ]);
    }
    /**
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function oembed(HTTPRequest $request)
    {
        // Grab the URL
        $url = $request->getVar('url');
        if (is_null($url) || !strlen($url)) {
            return new HTTPResponse_Exception();
        }
        // Check if this is a Cloudinary URL because it needs to be treated differently
        if (preg_match('/\.cloudinary\.com\/[^\/]+\/video\/upload/', $url)) {
            $data = $this->getCloudinaryDetails($url);
        } else {
            // Load any url:
            $webpage = Embed::create($url);
            // We only support these
            if (in_array($webpage->providerName, ['YouTube', 'Vimeo', 'SoundCloud', 'Spotify'])) {
                $data = [
                    'source' => strtolower($webpage->providerName),
                    'title' => $webpage->title,
                    'description' => $webpage->description,
                    'url' => $webpage->url,
                    'thumbnail' => $this->getThumbnail($webpage),
                    'src' => $this->getEmbedSource($webpage),
                ];
                if ($webpage->providerName !== 'Spotify') {
                    $data['author'] = [
                        'name' => $webpage->authorName,
                        'url' => $webpage->authorUrl,
                    ];
                }
            } else {
                $data = null;
            }
        }
        // Body & status code
        $responseBody = Convert::array2json($data);
        $statusCode = is_null($data) ? 404 : 200;
        // Get a new response going
        $response = new HTTPResponse($responseBody, $statusCode);
        // Add some headers
        $response->addHeader('Content-Type', 'application/json; charset=utf-8');
        $response->addHeader('Access-Control-Allow-Methods', 'GET');
        $response->addHeader('Access-Control-Allow-Origin', '*');
        // Return
        return $response;
    }
    /**
     * @param string $url
     * @return array
     */
    protected function getCloudinaryDetails($url)
    {
        $regex = '/.+\.cloudinary\.com\/([^\/]+)\/video\/upload\/(?:((?:[^_\/]+_[^,\/]+,?)*)\/)?(\w+)\/([^\.^\s]+)(?:\.(\w+))?/';
        if (!preg_match($regex, $url, $matches)) {
            return null;
        }
        // Grab effects
        $effects = $matches[2];
        // Deal with no effects
        if (!$effects) {
            $effects = [];
        } else {
            $effects = explode(',', $effects);
        }
        // Get rid of any codecs, only keeping filters
        $effects = array_filter($effects, function ($effect) {
            return !preg_match('/(ac|vc|w|c)_/', $effect);
        });
        // See if a specific quality has been specified
        $hasQuality = array_some($effects, function ($effect) {
            return strpos($effect, 'q_') === 0;
        });
        // Add auto quality if not specified
        if (!$hasQuality) {
            array_push($effects, 'q_auto');
        }
        // Generate thumbnail effects using specific size...
        $thumbnailEffects = array_merge(['c_scale', 'w_720', 'h_405'], $effects);
        $thumbnailEffects = implode(',', $thumbnailEffects);
        // ...and generate the thumbnail url
        $thumbnail = sprintf(
            'https://res.cloudinary.com/%s/video/upload/%s/%s/%s.jpg',
            $matches[1], $thumbnailEffects, $matches[3], $matches[4]
        );
        // Generate the data
        return [
            'source' => 'cloudinary',
            'title' => $matches[4],
            'url' => $url,
            'thumbnail' => $thumbnail,
            'src' => [
                'cloud_name' => $matches[1],
                'effects' => implode(',', $effects),
                'version' => $matches[3],
                'public_id' => $matches[4],
                'format' => $matches[5],
            ],
        ];
    }
    /**
     * @param Webpage $webpage
     * @return string|null
     */
    protected function getEmbedSource(Webpage $webpage)
    {
        if (!preg_match('/src="([^"]+)"/', $webpage->code, $matches)) {
            return null;
        }
        return $matches[1];
    }
    /**
     * @param Webpage $webpage
     * @return string|null
     */
    protected function getThumbnail(Webpage $webpage)
    {
        $thumbnail = null;
        $width = 0;
        if ($webpage->images) {
            foreach ($webpage->images as $image) {
                if ($image['width'] < $width) {
                    continue;
                }
                $thumbnail = $image['url'];
                $width = $image['width'];
            }
        }
        if (!$thumbnail && $webpage->image) {
            $thumbnail = $webpage->image;
        }
        if (strpos($thumbnail, 'i.vimeocdn.com/filter/overlay') !== false && preg_match('/src0=(.+)&/', $thumbnail, $matches)) {
            $thumbnail = urldecode($matches[1]);
        }
        return $thumbnail;
    }
}
