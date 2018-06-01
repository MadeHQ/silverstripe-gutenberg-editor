import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

import debounce from 'lodash/debounce';

class CloudinaryImageBlock extends Component {
    constructor(props) {
        super(props);
        this.uploadFieldInputChangeListener = this.uploadFieldInputChangeListener.bind(this);
        this.updateFileDataFromServer = this.updateFileDataFromServer.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.altTextChangeHandler = this.altTextChangeHandler.bind(this);

        this.state = {
            fileData: false,
            fileId: props.attributes.fileId,
            title: props.attributes.title,
            altText: props.attributes.altText,
        };
    }

    componentDidMount() {
        if (this.hasFileId()) {
            // Get File data before triggering entwine
            fetch(`/gutenberg-api/filedata/${this.getFileId()}`)
                .then(response => response.json())
                .then(this.updateFileDataFromServer)
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

    uploadFieldInputChangeListener(event) {
        const input = event.target.querySelector('input');
        if (!input) {
            this.setState({ fileId: false });
            return false;
        }
        this.setState({ fileId: input.value });
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

    renderFullPreviewImage() {
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
                            {this.renderFullPreviewImage()}
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
    },

    save: function(data) {
        return `<img src="${data.attributes.fileId}" alt="${data.attributes.altText}" title="${data.attributes.title}" />`;
    }
};
