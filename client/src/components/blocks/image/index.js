import ReactDOM from 'react-dom';

import { Component } from '@wordpress/element';

import { isEqual, debounce } from 'lodash';

import './style.scss';

class Image extends Component {
    constructor(props) {
        super(props);

        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.altTextChangeHandler = this.altTextChangeHandler.bind(this);
        this.heightChangeHandler = this.heightChangeHandler.bind(this);
        this.widthChangeHandler = this.widthChangeHandler.bind(this);

        this.state = {
            altText: props.attributes.altText,
            fileData: false,
            fileId: props.attributes.fileId,
            height: props.attributes.height,
            instanceId: props.instanceId,
            title: props.attributes.title,
            width: props.attributes.width,
        };

        this.setAttributes = debounce(this.setAttributes, 500);
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
                })
                .catch(error => {
                    this.setState({error});
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
        this.mutationObserver && this.mutationObserver.disconnect();
    }

    setState(state, onlyUpdateFileDataFromServer = false) {
        if (state.fileId !== undefined && state.fileId !== null) {
            this.setAttributes({ fileId: state.fileId });
            if (state.fileId && this.state.fileId !== state.fileId) {
                const that = this;
                fetch(`/gutenberg-api/filedata/${state.fileId}`)
                    .then(response => response.json())
                    .then(fileData => {
                        const newState = {
                            fileData,
                        }
                        if (!onlyUpdateFileDataFromServer) {
                            newState.title = fileData.title;
                            newState.altText = '';
                        }
                        that.setState(newState);
                    });
            }
        }
        if (state.title !== undefined) {
            this.setAttributes({title: state.title});
        }
        if (state.altText !== undefined) {
            this.setAttributes({altText: state.altText});
        }
        if (state.height !== undefined) {
            this.setAttributes({height: state.height});
        }
        if (state.width !== undefined) {
            this.setAttributes({width: state.width});
        }
        super.setState(state);
    }

    setAttributes(attrs) {
        this.props.setAttributes(attrs);
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

    /**
     * This is required for the Gallery (Remove) functionality to work
     */
    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (this.props.attributes.altText !== nextProps.attributes.altText) {
            newState.altText = nextProps.attributes.altText;
        }
        if (this.props.attributes.fileId !== nextProps.attributes.fileId) {
            newState.fileId = nextProps.attributes.fileId;
        }
        if (this.props.attributes.height !== nextProps.attributes.height) {
            newState.height = nextProps.attributes.height;
        }
        if (this.props.attributes.instanceId !== nextProps.attributes.instanceId) {
            newState.instanceId = nextProps.attributes.instanceId;
        }
        if (this.props.attributes.title !== nextProps.attributes.title) {
            newState.title = nextProps.attributes.title;
        }
        if (this.props.attributes.width !== nextProps.attributes.width) {
            newState.width = nextProps.attributes.width;
        }
        if (Object.keys(newState).length) {
            this.setState(newState, true);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(nextProps.attributes, this.props.attributes) || nextState;
    }


    renderWidthHeightFieldGroup() {
        return false;

        const { instanceId } = this.state;

        return (
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
        );
    }

    renderFullPreviewImageAndFields() {
        if (!this.hasFileId() || !this.fileDataIsLoaded()) {
            return null;
        }

        const { instanceId } = this.state;

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
                    {this.renderWidthHeightFieldGroup()}
                </fieldset>
            </div>
        );
    }

    render() {
        if (this.state.error) {
            return (
                <div className="gutenbergeditor-image gutenbergeditor-image__error ui-widget">Error loading file data</div>
            );
        }

        if (this.hasFileId() && !this.fileDataIsLoaded()) {
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
        const { instanceId } = this.state;
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
        const { instanceId } = this.state;
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

export default Image;
