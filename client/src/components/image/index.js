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
    mapValues,
    values,
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

        if (!value || isEmpty(value)) {
            value = {};
        }

        if (value && has(value, 'id')) {
            const oldValue = value;
            value = {};
            value[ oldValue.id ] = oldValue;
        }

        this.state = {
            instanceId: instanceId,
            files: value,
            error: null,
            loading: true,
        };

        this.mutationObserver = null;
        this.mounted = false;

        this.addListeners = this.addListeners.bind(this);
        this.entwineField = this.entwineField.bind(this);
        this.getStateData = this.getStateData.bind(this);
        this.getSchemaData = this.getSchemaData.bind(this);
    }

    componentDidMount() {
        let stateFiles = this.state.files;

        const promises = map(stateFiles, fileData => {
            return loadFileData(fileData.id);
        });

        Promise.all(promises)
        .then(files => {
            forEach(files, (file) => {
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

        let files = mapValues(state.files, file => {
            return omit(file, 'data');
        });

        if (!this.props.multiFiles) {
            files = values(files)[0];
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

                toAdd.forEach(fileData => {
                    stateFiles.push(fileData);
                });

                stateFiles = stateFiles.filter(fileId => {
                    return fileId;
                })

                let promises = map(stateFiles, fileId => {
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

    render() {
        if (this.state.loading) {
            return (
                <div className="ui-widget">Loading&nbsp;</div>
            );
        }

        if (this.state.error) {
            return (
                <div className="gutenbergeditor-image2 gutenbergeditor-image2__error ui-widget">Error loading file data</div>
            );
        }

        const { instanceId, files } = this.state;
        const { isSelected, multiFiles } = this.props;

        return (
            <div
                id={`Form_EditForm_DynamicImage${instanceId}_Holder`}
                className="gutenbergeditor-image2 no-change-track"
            >
                <div
                    id={`Form_EditForm_DynamicImage${instanceId}`}
                    className="no-change-track"
                    aria-describedby={`describes-Form_EditForm_DynamicImage${instanceId}`}
                    aria-labelledby={`title-Form_EditForm_DynamicImage${instanceId}`}
                >
                    <div id={`Form_EditForm_DynamicImage${instanceId}_File_Holder`}>
                        <div className="uploadfield-holder no-change-track" />

                        <input
                            type="file"
                            multiple="multiple"
                            className="entwine-uploadfield no-change-track"
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
    multiFiles: true,
    value: [],
};

export default withInstanceId(ImageControl);
