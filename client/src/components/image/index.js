import ReactDOM from 'react-dom';

import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/components';

import {
    forEach,
    keys,
    has,
    map,
    isEmpty,
    omit,
    isArray,
    isObject,
} from 'lodash';

const cloudinaryImage = window.cloudinaryImage;

import './style.scss';

const fileDataCache = {};

const loadFileData = fileId => {
    if ( fileId in fileDataCache ) {
        return fileDataCache[fileId];
    }

    fileDataCache[fileId] = fetch(`/gutenberg-api/filedata/${fileId}`, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(fileData => {
        return fileData;
    });

    return fileDataCache[fileId];
};

class ImageControl extends Component {
    constructor(props) {
        super(props);

        const { instanceId } = props;
        let { value } = props;

        if (value && !isArray(value)) {
            value = [value];
        }

        const files = value.reduce((carry, file) => {
            carry[file.id] = file;

            return carry;
        }, {});

        this.state = {
            instanceId: instanceId,
            files: files,
            error: null,
            loading: true,
        };

        this.mutationObserver = null;
        this.mounted = false;

        this.addListeners = this.addListeners.bind(this);
        this.entwineField = this.entwineField.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.updateCredit = this.updateCredit.bind(this);
        this.updateCaption = this.updateCaption.bind(this);
        this.getStateData = this.getStateData.bind(this);
        this.getSchemaData = this.getSchemaData.bind(this);
    }

    componentDidMount() {
        let stateFiles = this.state.files;

        const promises = keys(stateFiles).map(fileId => {
            return loadFileData(fileId);
        });

        Promise.all(promises)
        .then(files => {
            files.forEach(file => {
                stateFiles[file.id].data = file;
            });

            this.setState({
                files: stateFiles,
                loading: false,
            });
        })
        .finally(() => {
            this.addListeners();
            this.entwineField();
        });
    }

    componentDidUpdate() {
        this.addListeners();
        this.entwineField();
    }

    componentWillUnmount() {
        this.mutationObserver && this.mutationObserver.disconnect();
    }

    setState(state) {
        super.setState(state);

        if (!has(state, 'files')) {
            return false;
        }

        let files = map(state.files, file => {
            return omit(file, 'data');
        });

        if (!this.props.multiFiles) {
            files = files[0];
        }

        this.props.onChange( files );
    }

    addListeners() {
        if (this.mutationObserver || this.state.loading) {
            return false;
        }

        // select the target node
        const targetNode = ReactDOM.findDOMNode(this);

        // Create an observer instance linked to the callback function
        this.mutationObserver = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type !== 'childList') {
                    continue;
                }

                if (mutation.target.className !== 'uploadfield') {
                    continue;
                }

                let toRemove = [], toAdd = [];

                forEach(mutation.addedNodes, node => {
                    if (!node.className) {
                        return true;
                    }

                    if (node.className.indexOf('uploadfield-item--image') === -1) {
                        return true;
                    }

                    toAdd.push(parseInt(node.querySelector('input[type=hidden]').value, 10));
                });

                forEach(mutation.removedNodes, node => {
                    if (!node.className) {
                        return true;
                    }

                    if (node.className.indexOf('uploadfield-item--image') === -1) {
                        return true;
                    }

                    toRemove.push(parseInt(node.querySelector('input[type=hidden]').value, 10));
                });

                let stateFiles = [];

                forEach(this.state.files, (file, id) => {
                    if (toRemove.indexOf(parseInt(id, 10)) !== -1) {
                        return true;
                    }

                    stateFiles.push(id);
                });

                toAdd.forEach(fileId => {
                    stateFiles.push(fileId);
                });

                let promises = stateFiles.map(fileId => {
                    return loadFileData(fileId);
                });

                Promise.all(promises).then(files => {
                    let toSave = {};

                    files.forEach(file => {
                        let existing = this.state.files[file.id];

                        if (existing) {
                            toSave[file.id] = existing;

                            if (!has(existing, 'data')) {
                                toSave[file.id].data = file;
                            }
                        } else {
                            toSave[file.id] = {
                                credit: '',
                                caption: '',
                                id: file.id,
                                url: file.url,
                                data: file,
                            };
                        }
                    });

                    this.setState({ files: toSave });
                });
            }
        });

        // Start observing the target node for configured mutations
        // with pptions for the observer (which mutations to observe)
        this.mutationObserver.observe(targetNode, {
            childList: true,
            subtree: true,
        });
    }

    entwineField() {
        if (this.mounted || this.state.loading) {
            return false;
        }

        jQuery.entwine.triggerMatching();
        this.mounted = true;
    }

    updateCredit(file, value) {
        let files = this.state.files;

        files[file].credit = value;

        this.setState({ files: files });
    }

    updateCaption(file, value) {
        let files = this.state.files;

        files[file].caption = value;

        this.setState({ files: files });
    }

    renderImage(image) {
        // this.setState({ credit: e.target.value })
        // Adds the `ui-widget` class so as to reset the font being used (want it to match the rest of the admin)
        return (
            <div key={ image.id } className="full-preview ui-widget">
                <img className="full-preview__image" src={ cloudinaryImage(image.url, 606, 341) } />

            { (this.props.allowCredit || this.props.allowCaption) && (
                <fieldset className="full-preview__fields">

                { this.props.allowCredit && (
                    <div id={`DynamicImage${image.id}_Caption_Holder`}>
                        <label
                            htmlFor={`DynamicImage${image.id}_Credit`}
                            id={`title-DynamicImage${image.id}_Credit`}
                            className="screen-reader-text"
                        >
                            Credit
                        </label>

                        <input
                            type="text"
                            className="text"
                            placeholder="Credit (&copy;)"
                            id={ `DynamicImage${image.id}_Credit` }
                            value={ image.credit }
                            onChange={ e => this.updateCredit(image.id, e.target.value) }
                        />
                    </div>
                ) }

                { this.props.allowCaption && (
                    <div id={`DynamicImage${image.id}_Caption_Holder`}>
                        <label
                            htmlFor={`DynamicImage${image.id}_Caption`}
                            id={`title-DynamicImage${image.id}_Caption`}
                            className="screen-reader-text"
                        >
                            Caption
                        </label>

                        <input
                            type="text"
                            className="text"
                            placeholder="Caption"
                            id={ `DynamicImage${image.id}_Caption` }
                            value= { image.caption }
                            onChange={ e => this.updateCaption(image.id, e.target.value) }
                        />
                    </div>
                ) }

                </fieldset>
            ) }
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="ui-widget">Loading</div>
            );
        }

        if (this.state.error) {
            return (
                <div className="gutenbergeditor-image2 gutenbergeditor-image2__error ui-widget">Error loading file data</div>
            );
        }

        const { instanceId, files } = this.state;
        const { isSelected, multiFiles } = this.props;

        const showUploader = isEmpty(files) || isSelected || !multiFiles;

        let classes = ['gutenbergeditor-image2'];

        if (!showUploader) {
            classes.push('is-hidden');
        }

        if (!multiFiles) {
            classes.push('single-image');
        }

        if (map(this.state.files).length === 1) {
            classes.push('has-one');
        }

        classes = classes.join(' ');

        return (
            <div
                id={`Form_EditForm_DynamicImage${instanceId}_Holder`}
                className={ classes }
            >
                <div
                    id={`Form_EditForm_DynamicImage${instanceId}`}
                    aria-describedby={`describes-Form_EditForm_DynamicImage${instanceId}`}
                    aria-labelledby={`title-Form_EditForm_DynamicImage${instanceId}`}
                >
                    <div id={`Form_EditForm_DynamicImage${instanceId}_File_Holder`}>
                    { !isEmpty(this.state.files) && (
                        <div className="full-preview-holder">
                            <div className="full-preview-list">
                                { map(this.state.files, this.renderImage) }
                            </div>
                        </div>
                    ) }

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
            },
        }

        const fileKeys = keys(this.state.files).map(file => parseInt(file, 10));
        const fileData = map(this.state.files, file => file.data);

        if (fileKeys.length) {
            state.value.Files = fileKeys;
            state.data.files = fileData;
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
                maxFiles: this.props.multiFiles ? 50 : 1,
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
    multiFiles: true,
    value: [],
};

export default withInstanceId(ImageControl);
