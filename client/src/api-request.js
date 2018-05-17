
/**
 * Thin jQuery.ajax wrapper for WP REST API requests.
 *
 * Currently only applies to requests that do not use the `wp-api.js` Backbone
 * client library, though this may change.  Serves several purposes:
 *
 * - Allows overriding these requests as needed by customized WP installations.
 * - Sends the REST API nonce as a request header.
 * - Allows specifying only an endpoint namespace/path instead of a full URL.
 *
 * @link https://github.com/WordPress/WordPress/blob/master/wp-includes/js/api-request.js
 * @since     4.9.0
 */

( function( $ ) {
    function apiRequest( options ) {
        options = apiRequest.buildAjaxOptions( options );
        return apiRequest.transport( options );
    }

    apiRequest.buildAjaxOptions = function( options ) {
        var url = options.url;
        var path = options.path;

        if (typeof options.namespace === 'string' && typeof options.endpoint === 'string') {
            var endpointTrimmed = options.endpoint.replace( /^\//, '' );

            path = options.namespace.replace( /^\/|\/$/g, '' );

            if ( endpointTrimmed ) {
                path += '/' + endpointTrimmed;
            }
        }

        if (!url && path) {
            url = path;
        }

        url = url.replace('wp/v2', 'gutenberg-api');

        // Do not mutate the original options object.
        options = $.extend( {}, options, {
            url: url
        } );

        delete options.path;
        delete options.namespace;
        delete options.endpoint;

        return options;
    };

    apiRequest.transport = $.ajax;

    /** @namespace wp */
    window.wp = window.wp || {};
    window.wp.apiRequest = apiRequest;
} )( jQuery );
