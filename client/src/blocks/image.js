import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

class CloudinaryImageBlock extends Component {
    constructor(props) {
        super(props);
        this.handleAddInsert.bind(this);
        this.state = {
            showUpload: false
        };
    }

    handleAddInsert() {
        console.log('CloudinaryImageBlock::handleAddInsert', this);
    }

    onBrowse(folderId, fileId, query) {
        console.log(this, folderId, fileId, query, ...arguments);
        debugger;
    }

    getHolder() {
        return ReactDOM.findDOMNode(this).querySelector('.uploadfield-holder');
    }

    renderUploadField() {
        return false;

        const UploadField = Injector.loadComponent('UploadField', {context: 'pages-controller-cms-content'});
        const props = schemaFieldValues.schemaMerge(this.getSchemaData(), this.getStateData());
        const onChange = () => {
            console.log('image::onChange', ...arguments);
        }
        return (
            <UploadField
                {...props}
                onChange={onChange}
                noHolder
            />
        );
    }

    render() {
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
                            <div className="uploadfield-holder">
                            </div>
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
        return {
            "name": `DynamicImage${instanceId}[File]`,
            "id": `Form_EditForm_DynamicImage${instanceId}_File`,
            "value": {
                "Files": []
            },
            "message": null,
            "data": {
                "files": []
            }
        }
    }

    getSchemaData() {
        const { instanceId } = this.props;
        return {
            "name": `DynamicImage${instanceId}[File]`,
            "id": `Form_EditForm_DynamicImage${instanceId}_File`,
            "type": "file",
            "schemaType": "Custom",
            "component": "UploadField",
            "holderId": `Form_EditForm_DynamicImage${instanceId}_File_Holder`,
            "title": "File",
            "source": null,
            "extraClass": "entwine-uploadfield uploadfield",
            "description": null,
            "rightTitle": null,
            "leftTitle": null,
            "readOnly": false,
            "disabled": false,
            "customValidationMessage": "",
            "validation": [],
            "attributes": [],
            "autoFocus": false,
            "data":  {
                "createFileEndpoint":  {
                    "url": `admin\/pages\/edit\/EditForm\/1\/field\/DynamicImage${instanceId}[File]\/upload`,
                    "method": "post",
                    "payloadFormat":  "urlencoded"
                },
                "maxFiles": 1,
                "multi": true,
                "parentid": 1,
                "canUpload": true,
                "canAttach": true
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

    save: function() {
        console.log('CloudinaryImageBlock::settings::save', ...arguments);
    }
};
