<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\Control\Controller;

class EmbedBlock extends BaseBlock
{
    /**
     * @config
     * @var int
     */
    private static $width = 560;

    /**
     * @config
     * @var int
     */
    private static $height = 315;

    /**
     * @config
     * @var String
     */
    private static $wrapperClass = '';

    /**
     * @param string $content
     * @param array $attributes
     * @return string
     */
    public function render($content, array $attributes = array())
    {
        $width = sprintf('width="%s"', static::config()->get('width'));
        $height = sprintf('height="%s"', static::config()->get('height'));

        $wrapperClass = static::config()->get('wrapperClass');

        if (!array_key_exists('html', $attributes)) {
            return sprintf("<div class=\"embed-block %s\">%s</div>", $wrapperClass, $content);
        }

        $markup = $attributes['html'];

        preg_match('/src\s*=\s*"(.+?)"/', $markup, $matches);

        if (count($matches) === 2) {
            $url = $matches[1];

            if (stripos($url, 'youtube') !== false) {
                $url = Controller::join_links($url, '?rel=0&fs=0&showinfo=0');
            }

            $markup = str_replace($matches[1], $url, $markup);
        }

        // Replace width & height
        $markup = preg_replace(['/width="(\w+)"/', '/height="(\w+)"/'], [$width, $height], $markup);

        return sprintf("<div class=\"embed-block %s\">%s</div>", $wrapperClass, $markup);
    }
}
