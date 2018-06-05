import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

import debounce from 'lodash/debounce';

class CloudinaryImageBlock extends Component {
    constructor(props) {
        super(props);
        this.updateFileDataFromServer = this.updateFileDataFromServer.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.altTextChangeHandler = this.altTextChangeHandler.bind(this);
        this.heightChangeHandler = this.heightChangeHandler.bind(this);
        this.widthChangeHandler = this.widthChangeHandler.bind(this);

        this.state = {
            fileData: false,
            fileId: props.attributes.fileId,
            title: props.attributes.title,
            altText: props.attributes.altText,
            height: props.attributes.height,
            width: props.attributes.width,
        };
    }

    componentDidMount() {
        if (this.hasFileId()) {
            // Get File data before triggering entwine
            fetch(`/gutenberg-api/filedata/${this.getFileId()}`)
                .then(response => response.json())
                .then((fileData) => {
                    // Will use the state value if supplied otherwise use the image width/height
                    const width = this.state.width || fileData.previewWidth;
                    const height = this.state.height || fileData.previewHeight;

                    this.setState({
                        fileData,
                        height,
                        width
                    })
                })
                .then(() => {
                    jQuery.entwine.triggerMatching();
                });
        } else {
            this.addListeners();
            jQuery.entwine.triggerMatching();
        }
    }

    componentDidUpdate() {
        this.addListeners();
    }

    titleChangeHandler(title) {
        this.setState({title});
    }

    altTextChangeHandler(altText) {
        this.setState({altText});
    }

    /**
     * Prevent the height from going above the original height
     * @param int height
     */
    heightChangeHandler(height) {
        if (height > this.state.fileData.height) {
            return false;
        }
        this.setState({height});
    }

    /**
     * Prevent the width from going above the original width
     * @param int width
     */
    widthChangeHandler(width) {
        if (width > this.state.fileData.width) {
            return false;
        }
        this.setState({width});
    }

    addListeners() {
        if (!this.mutationObserver) {
            // select the target node
            const targetNode = ReactDOM.findDOMNode(this)

            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: true, subtree: true };

            // Callback function to execute when mutations are observed
            const callback = function(mutationsList) {
                for(let mutation of mutationsList) {
                    if (
                        mutation.type == 'attributes' &&
                        mutation.attributeName === 'value' &&
                        mutation.target.type === 'hidden'
                    ) {
                        this.setState({fileId: mutation.target.value});
                    }
                }
            };

            // Create an observer instance linked to the callback function
            this.mutationObserver = new MutationObserver(callback.bind(this));

            // Start observing the target node for configured mutations
            this.mutationObserver.observe(targetNode, config);
        }
    }

    componentWillUnmount()
    {
        this.mutationObserver.disconnect();
    }

    updateFileDataFromServer(fileData) {
        this.setState({
            fileData,
            title: fileData.title,
            altText: '',
        });
    }

    setState(state) {
        if (state.fileId !== undefined && state.fileId !== null) {
            this.props.setAttributes({ fileId: state.fileId });
            if (state.fileId && this.state.fileId !== state.fileId) {
                fetch(`/gutenberg-api/filedata/${state.fileId}`)
                    .then(response => response.json())
                    .then(this.updateFileDataFromServer);
            }
        }
        if (state.title !== undefined) {
            this.props.setAttributes({title: state.title});
        }
        if (state.altText !== undefined) {
            this.props.setAttributes({altText: state.altText});
        }
        if (state.height !== undefined) {
            this.props.setAttributes({height: state.height});
        }
        if (state.width !== undefined) {
            this.props.setAttributes({width: state.width});
        }
        super.setState(state);
    }

    hasFileId() {
        return !!this.state.fileId;
    }

    getFileId() {
        return this.state.fileId;
    }

    fileDataIsLoaded() {
        return !!this.state.fileData;
    }

    getFileData() {
        return this.state.fileData;
    }

    renderFullPreviewImageAndFields() {
        if (!this.hasFileId() || !this.fileDataIsLoaded()) {
            return null;
        }

        const { instanceId } = this.props;

        // Adds the `ui-widget` class so as to reset the font being used (want it to match the rest of the admin)
        return (
            <div className="full-preview ui-widget">
                <img className="full-preview__image" src={this.getFileData().largeThumbnail} />
                <fieldset className="full-preview__fields">
                    <div id={`DynamicImage${instanceId}_Title_Holder`}>
                        <label htmlFor={`DynamicImage${instanceId}_Title`} id={`title-DynamicImage${instanceId}_Title`}>Title</label>
                        <div>
                            <input type="text" className="text" id={`DynamicImage${instanceId}_Title`} value={this.state.title} onChange={e => this.titleChangeHandler(e.target.value)} />
                        </div>
                    </div>
                    <div id={`DynamicImage${instanceId}_AltText_Holder`}>
                        <label htmlFor={`DynamicImage${instanceId}_AltText`} id={`title-DynamicImage${instanceId}_AltText`}>Alt</label>
                        <div>
                            <input type="text" className="text" id={`DynamicImage${instanceId}_AltText`} value={this.state.altText} onChange={e => this.altTextChangeHandler(e.target.value)} />
                        </div>
                    </div>
                    <div className="form__fieldgroup field CompositeField fieldgroup">
                        <div id={`DynamicImage${instanceId}_Height_Holder`} className="form__fieldgroup-item field field--small">
                            <label htmlFor={`DynamicImage${instanceId}_Height`} id={`title-DynamicImage${instanceId}_Height`}>Height</label>
                            <div>
                                <input placeholder={this.state.height} type="number" className="text" id={`DynamicImage${instanceId}_Height`} value={this.state.height} onChange={e => this.heightChangeHandler(e.target.value)} />
                            </div>
                            <div className="form__field-description">
                                max. {this.state.fileData.height}px
                            </div>
                        </div>
                        <div id={`DynamicImage${instanceId}_Width_Holder`} className="form__fieldgroup-item field field--small">
                            <label htmlFor={`DynamicImage${instanceId}_Width`} id={`title-DynamicImage${instanceId}_Width`}>Width</label>
                            <div>
                                <input placeholder={this.state.width} type="number" className="text" id={`DynamicImage${instanceId}_Width`} value={this.state.width} onChange={e => this.widthChangeHandler(e.target.value)} />
                            </div>
                            <div className="form__field-description">
                                max. {this.state.fileData.width}px
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }

    render() {
        if (this.hasFileId() && !this.fileDataIsLoaded()) {
            return (
                <div>Loading</div>
            );
        }

        const { instanceId } = this.props;

        return (
            <div
                id={`Form_EditForm_DynamicImage${instanceId}_Holder`}
                className="gutenbergeditor-image"
            >
                <div
                    id={`Form_EditForm_DynamicImage${instanceId}`}
                    aria-describedby={`describes-Form_EditForm_DynamicImage${instanceId}`}
                    aria-labelledby={`title-Form_EditForm_DynamicImage${instanceId}`}
                >
                    <div id={`Form_EditForm_DynamicImage${instanceId}_File_Holder`}>
                        <div>
                            {this.renderFullPreviewImageAndFields()}
                            <div className="uploadfield-holder" />
                            <input
                                type="file"
                                multiple="multiple"
                                className="entwine-uploadfield"
                                id={`Form_EditForm_DynamicImage${instanceId}_File`}
                                aria-labelledby={`title-Form_EditForm_DynamicImage${instanceId}_File`}
                                data-schema={JSON.stringify(this.getSchemaData())}
                                data-state={JSON.stringify(this.getStateData())}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    getStateData() {
        const { instanceId } = this.props;
        const state = {
            'name': `DynamicImage${instanceId}[File]`,
            'id': `Form_EditForm_DynamicImage${instanceId}_File`,
            'value': {
                'Files': []
            },
            'message': null,
            'data': {
                'files': []
            }
        }
        if (this.hasFileId()) {
            state.value.Files.push(this.getFileId());
            state.data.files.push(this.getFileData());
        }
        return state;
    }

    getSchemaData() {
        const { instanceId } = this.props;
        return {
            'name': `DynamicImage${instanceId}[File]`,
            'id': `Form_EditForm_DynamicImage${instanceId}_File`,
            'type': "file",
            'schemaType': "Custom",
            'component': "UploadField",
            'holderId': `Form_EditForm_DynamicImage${instanceId}_File_Holder`,
            'title': "File",
            'source': null,
            'extraClass': "entwine-uploadfield uploadfield",
            'description': null,
            'rightTitle': null,
            'leftTitle': null,
            'readOnly': false,
            'disabled': false,
            'customValidationMessage': '',
            'validation': [],
            'attributes': [],
            'autoFocus': false,
            'data':  {
                'createFileEndpoint':  {
                    'url': `admin\/pages\/edit\/EditForm\/1\/field\/DynamicImage${instanceId}[File]\/upload`,
                    'method': "post",
                    'payloadFormat':  "urlencoded"
                },
                'maxFiles': 1,
                'multi': true,
                'parentid': 1,
                'canUpload': true,
                'canAttach': true
            }
        };
    }
}

const schema = {
	content: {
		type: 'object'
	},
};

const supports = {
	className: false,
};

export const name = 'madehq/image-selector';

export const settings = {
    title: __( 'Image' ),

    description: __( 'This will allow you to pull an image into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit: withInstanceId(CloudinaryImageBlock),

    attributes: {
        fileId: {
            type: 'string',
            selector: 'input[type="hidden"]',
            default: false,
        },
        title: {
            type: 'string',
        },
        altText: {
            type: 'string',
        },
        height: {
            type: 'string'
        },
        width: {
            type: 'string'
        },
    },

    save: function(data) {
        return `<img src="${data.attributes.fileId}" alt="${data.attributes.altText}" title="${data.attributes.title}" />`;
    }
};
