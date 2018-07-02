import ReactDOM from 'react-dom';

import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';

import { isEqual, debounce } from 'lodash';

import './style.scss';

const fileDataCache = {};

const loadFileData = fileId => {
    if ( fileId in fileDataCache ) {
        return fileDataCache[fileId];
    }

    fileDataCache[fileId] = fetch(`/gutenberg-api/filedata/${fileId}`)
    .then(response => response.json())
    .then(fileData => {
        return fileData;
    });

    return fileDataCache[fileId];
};

class ImageControl extends Component {
    constructor(props) {
        super(props);

        const { instanceId, value } = props;

        const values = {
            caption: '',
            credit: '',
            id: null,
        };

        if (value) {
            values.caption = value.caption;
            values.credit = value.credit;
            values.id = value.id;
        }

        this.state = {
            instanceId: instanceId,
            caption: values.caption,
            credit: values.credit,
            fileId: values.id,
            fileData: null,
            error: null,
        };

        this.mutationObserver = null;
        this.mounted = false;
    }

    componentDidMount() {
        this.getFileData();

        this.addListeners();
        this.entwineField();
    }

    componentWillUpdate() {
        this.getFileData();
    }

    componentDidUpdate() {
        this.addListeners();
        this.entwineField();
    }

    componentWillUnmount() {
        this.mutationObserver && this.mutationObserver.disconnect();
    }

    getFileData() {
        const { fileId, fileData } = this.state;

        if (!fileId) {
            return false;
        }

        if (fileId && fileData && parseInt(fileId, 10) === parseInt(fileData.id, 10)) {
            return false;
        }

        loadFileData(fileId)
        .then(fileData => {
            this.setState({
                fileData: fileData,
                error: null,
            });
        })
        .catch(error => {
            this.setState({ error });
        });
    }

    addListeners() {
        if (this.mutationObserver) {
            return false;
        }

        // select the target node
        const targetNode = ReactDOM.findDOMNode(this);

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // Create an observer instance linked to the callback function
        this.mutationObserver = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (
                    mutation.type == 'attributes' &&
                    mutation.attributeName === 'value' &&
                    mutation.target.type === 'hidden'
                ) {
                    this.setState({
                        fileId: mutation.target.value,
                    });
                }
            }
        });

        // Start observing the target node for configured mutations
        this.mutationObserver.observe(targetNode, config);
    }

    entwineField() {
        if (this.mounted) {
            return false;
        }

        jQuery.entwine.triggerMatching();
        this.mounted = true;
    }

    setState(state) {
        super.setState(state);

        const changes = {
            ...this.state,
            ...state,
        };

        this.props.onChange({
            credit: changes.credit,
            caption: changes.caption,
            id: changes.fileId,
            url: changes.fileData ? changes.fileData.url : undefined,
        });
    }

    renderFullPreviewImageAndFields() {
        if (!this.state.fileId && !this.state.fileData) {
            return false;
        }

        const { instanceId, fileData } = this.state;

        // Adds the `ui-widget` class so as to reset the font being used (want it to match the rest of the admin)
        return (
            <div className="full-preview ui-widget">
                <img className="full-preview__image" src={ fileData.thumbnail } />
            { !this.props.allowCredit && !this.props.allowCaption && (
                <fieldset className="full-preview__fields">
                { this.props.allowCredit && (
                    <div id={`DynamicImage${instanceId}_Caption_Holder`}>
                        <label
                            htmlFor={`DynamicImage${instanceId}_Credit`}
                            id={`title-DynamicImage${instanceId}_Credit`}
                            className="screen-reader-text"
                        >
                                Credit
                        </label>

                        <input
                            type="text"
                            className="text"
                            placeholder="Credit (&copy;)"
                            id={ `DynamicImage${instanceId}_Credit` }
                            value={ this.state.credit }
                            onChange={ e => this.setState({ credit: e.target.value }) }
                        />
                    </div>
                ) }

                { this.props.allowCaption && (
                    <div id={`DynamicImage${instanceId}_Caption_Holder`}>
                        <label
                            htmlFor={`DynamicImage${instanceId}_Caption`}
                            id={`title-DynamicImage${instanceId}_Caption`}
                            className="screen-reader-text"
                        >
                            Caption
                        </label>

                        <input
                            type="text"
                            className="text"
                            placeholder="Caption"
                            id={ `DynamicImage${instanceId}_Caption` }
                            value= { this.state.caption }
                            onChange={ e => this.setState({ caption: e.target.value }) }
                        />
                    </div>
                ) }
                </fieldset>
            ) }
            </div>
        );
    }

    render() {
        if (this.state.error) {
            return (
                <div className="gutenbergeditor-image gutenbergeditor-image__error ui-widget">Error loading file data</div>
            );
        }

        if (this.state.fileId && !this.state.fileData) {
            return (
                <div className="ui-widget">Loading</div>
            );
        }

        const { instanceId } = this.state;

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
                            { this.renderFullPreviewImageAndFields() }

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
        const { instanceId } = this.state;

        const state = {
            name: `DynamicImage${instanceId}[File]`,
            id: `Form_EditForm_DynamicImage${instanceId}_File`,
            value: {
                Files: []
            },
            message: null,
            data: {
                files: []
            }
        }

        if (this.state.fileId) {
            state.value.Files.push(this.state.fileId);
            state.data.files.push(this.state.fileData);
        }

        return state;
    }

    getSchemaData() {
        const { instanceId } = this.state;

        return {
            name: `DynamicImage${instanceId}[File]`,
            id: `Form_EditForm_DynamicImage${instanceId}_File`,
            type: "file",
            schemaType: "Custom",
            component: "UploadField",
            holderId: `Form_EditForm_DynamicImage${instanceId}_File_Holder`,
            title: "File",
            source: null,
            extraClass: "entwine-uploadfield uploadfield",
            description: null,
            rightTitle: null,
            leftTitle: null,
            readOnly: false,
            disabled: false,
            customValidationMessage: '',
            validation: [],
            attributes: [],
            autoFocus: false,
            data:  {
                createFileEndpoint:  {
                    url: `admin\/pages\/edit\/EditForm\/1\/field\/DynamicImage${instanceId}[File]\/upload`,
                    method: "post",
                    payloadFormat:  "urlencoded"
                },
                maxFiles: 1,
                multi: true,
                parentid: 1,
                canUpload: true,
                canAttach: true
            }
        };
    }
}

ImageControl.defaultProps = {
    allowCaption: true,
    allowCredit: true,
};

export default withInstanceId(ImageControl);
