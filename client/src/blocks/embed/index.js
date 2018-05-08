import { parse } from 'url';
import { includes, kebabCase, toLower } from 'lodash';
import { isBlockFeatureEnabled, getConfigValue } from '../../config';

import * as embed from '@wordpress/blocks/library/embed';
import { __, sprintf } from '@wordpress/i18n';
import { stringify } from 'querystring';
import classnames from 'classnames';

import {
    BlockControls,
    BlockAlignmentToolbar,
    RichText,
    InspectorControls,
} from '@wordpress/blocks';

import {
    Spinner,
    Placeholder,
    Button,
    SandBox,
    PanelBody,
} from '@wordpress/components';

// These embeds do not work in sandboxes
const HOSTS_NO_PREVIEWS = [ 'facebook.com' ];

const title = 'Embed';
const icon = 'embed-generic';

class EmbedBlock extends embed.settings.edit {
    doServerSideRender(event) {
        if (event) {
            event.preventDefault();
        }

        const { url } = this.props.attributes;
        const { setAttributes } = this.props;

        this.setState({
            error: false,
            fetching: true,
        });

        wp.apiRequest({ path: `${getConfigValue('oembed')}?${stringify({url})}` })
        .then(obj => {
            if (this.unmounting) {
                return;
            }

            const { html, provider_name: providerName } = obj;
            const providerNameSlug = kebabCase(toLower(providerName));
            let { type } = obj;

            if (includes(html, 'class="wp-embedded-content" data-secret')) {
                type = 'wp-embed';
            }

            if (html) {
                this.setState({
                    html, type, providerNameSlug,
                });

                setAttributes({
                    html, type, providerNameSlug,
                });
            } else if ('photo' === type) {
                this.setState({
                    html: this.getPhotoHtml(obj),
                    type,
                    providerNameSlug
                });

                setAttributes({
                    html: this.getPhotoHtml(obj),
                    type,
                    providerNameSlug
                });
            }

            this.setState({
                fetching: false,
            });
        }, () => {
            this.setState({
                fetching: false,
                error: true,
            });
        });
    }

    render() {
        const { html, type, error, fetching } = this.state;
        const { align, url, caption } = this.props.attributes;
        const { setAttributes, isSelected, className } = this.props;
        const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );

        const blockAlignmentEnabled = isBlockFeatureEnabled('embed', 'blockAlignment');
        const captionEnabled = isBlockFeatureEnabled('embed', 'caption');

        const controls = isSelected && blockAlignmentEnabled && (
            <BlockControls key="controls">
                <BlockAlignmentToolbar
                    value={ align }
                    onChange={ updateAlignment }
                />
            </BlockControls>
        );

        if ( fetching ) {
            return [
                controls,
                <div key="loading" className="wp-block-embed is-loading">
                    <Spinner />
                    <p>{ __( 'Embedding…' ) }</p>
                </div>,
            ];
        }

        if ( ! html ) {
            const label = sprintf( __( '%s URL' ), title );

            return [
                controls,
                <Placeholder key="placeholder" icon={ icon } label={ label } className="wp-block-embed">
                    <form onSubmit={ this.doServerSideRender }>
                        <input
                            type="url"
                            value={ url || '' }
                            className="components-placeholder__input"
                            aria-label={ label }
                            placeholder={ __( 'Enter URL to embed here…' ) }
                            onChange={ ( event ) => setAttributes( { url: event.target.value } ) } />
                        <Button
                            isLarge
                            type="submit">
                            { __( 'Embed' ) }
                        </Button>
                        { error && <p className="components-placeholder__error">{ __( 'Sorry, we could not embed that content.' ) }</p> }
                    </form>
                </Placeholder>,
            ];
        }

        const parsedUrl = parse( url );
        const cannotPreview = includes( HOSTS_NO_PREVIEWS, parsedUrl.host.replace( /^www\./, '' ) );
        const iframeTitle = sprintf( __( 'Embedded content from %s' ), parsedUrl.host );
        const embedWrapper = 'wp-embed' === type ? (
            <div
                className="wp-block-embed__wrapper"
                dangerouslySetInnerHTML={ { __html: html } }
            />
        ) : (
            <div className="wp-block-embed__wrapper">
                <SandBox
                    html={ html }
                    title={ iframeTitle }
                    type={ type }
                />
            </div>
        );

        return [
            controls,
            <figure key="embed" className={ classnames( className, { 'is-video': 'video' === type } ) }>
                { ( cannotPreview ) ? (
                    <Placeholder icon={ icon } label={ __( 'Embed URL' ) }>
                        <p className="components-placeholder__error"><a href={ url }>{ url }</a></p>
                        <p className="components-placeholder__error">{ __( 'Previews for this are unavailable in the editor, sorry!' ) }</p>
                    </Placeholder>
                ) : embedWrapper }

                { ( captionEnabled && caption && caption.length > 0 ) || isSelected ? (
                    <RichText
                        tagName="figcaption"
                        placeholder={ __( 'Write caption…' ) }
                        value={ caption }
                        onChange={ ( value ) => setAttributes( { caption: value } ) }
                        isSelected={ isSelected }
                        inlineToolbar
                    />
                ) : null }
            </figure>,
        ];
    }
}

export const name = embed.name;

export const settings = {
    ...embed.settings,

    edit: EmbedBlock,

    attributes: {
        url: {
            type: 'string',
        },
        html: {
            type: 'string',
        },
        caption: {
            type: 'array',
            source: 'children',
            selector: 'figcaption',
            default: [],
        },
        align: {
            type: 'string',
        },
        type: {
            type: 'string',
        },
        providerNameSlug: {
            type: 'string',
        },
    },
};
