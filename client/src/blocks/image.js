import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

class CloudinaryImageBlock extends Component {
    constructor(props) {
        super(props);
        this.uploadFieldInputChangeListener = this.uploadFieldInputChangeListener.bind(this);
        this.updateFileDataFromServer = this.updateFileDataFromServer.bind(this);
        this.state = {
            fileData: false,
            fileId: props.attributes.file_id,
        };
    }

    componentDidMount() {
        if (this.hasFileId()) {
            // Get File data and then it should update
            fetch(`/gutenberg-api/filedata/${this.getFileId()}`).then(response => response.json()).then(this.updateFileDataFromServer);
        } else {
            ReactDOM.findDOMNode(this).addEventListener('DOMSubtreeModified', this.uploadFieldInputChangeListener, false);
            jQuery.entwine.triggerMatching();
        }
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this).addEventListener('DOMSubtreeModified', this.uploadFieldInputChangeListener, false);
        jQuery.entwine.triggerMatching();
    }

    updateFileDataFromServer(fileData) {
        this.setState({
            fileData
        });
    }

    uploadFieldInputChangeListener(event) {
        const input = event.target.querySelector('input');
        if (!input) {
            this.props.setAttributes( { file_id: false } );
            return false;
        }
        this.props.setAttributes( { file_id: input.value } );
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
            >
                <div
                    id={`Form_EditForm_DynamicImage${instanceId}`}
                    aria-describedby={`describes-Form_EditForm_DynamicImage${instanceId}`}
                    aria-labelledby={`title-Form_EditForm_DynamicImage${instanceId}`}
                >
                    <div id={`Form_EditForm_DynamicImage${instanceId}_File_Holder`}>
                        <div>
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

export const name = 'madehq/cloudinary';

export const settings = {
    title: __( 'Cloudinary Image' ),

    description: __( 'This will allow you to pull an image into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit: withInstanceId(CloudinaryImageBlock),

    attributes: {
        file_id: {
            type: 'string',
            selector: 'input[type="hidden"]',
            default: false,
        },
    },

    save: function(data) {
        return `<img src="${data.attributes.file_id}" alt="" />`;
    }
};
