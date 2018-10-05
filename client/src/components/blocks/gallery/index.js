import { Component } from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import ReactDOM from 'react-dom';
import Image from '../image';

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.addItem = this.addItem.bind(this);
        this.renderGalleryItem = this.renderGalleryItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.state = {
            items: props.attributes.items || [],
        };
    }

    componentDidMount() {
        if (!this.state.items.length) {
            this.addItem();
        }
    }

    /**
     * Append a new item to the gallery
     */
    addItem() {
        const items = this.state.items.slice(0);
        items.push({});
        this.setState({items});
    }

    /**
     * Removes the item based on the index provided
     */
    removeItem(index) {
        const items = this.state.items.slice(0);
        items.splice(index, 1);
        this.setState({items});
    }

    renderGalleryItem(item, index) {
        const instanceId = this.props.instanceId;
        let setAttributes = (newData) => {
            this.updateItem(newData, index);
        };
        setAttributes = setAttributes.bind(this);

        return (
            <div className="gutenberg-gallery__item" key={index}>
                <button
                    className="gutenberg-gallery__item-remove font-icon-cancel"
                    onClick={() => {this.removeItem(index)}}
                    title="Remove"
                />
                <Image
                    key={index}
                    attributes={item}
                    setAttributes={setAttributes}
                    instanceId={`gallery-${instanceId}-${index}-${item.fileId}`}
                />
            </div>
        );
    }

    updateItem(newData, index) {
        const items = this.state.items.slice(0);
        items[index] = Object.assign(items[index], newData);
        this.props.setAttributes({items});
    }

    renderAddItem() {
        return (
            <div className="" onClick={this.addItem}>
                Add
            </div>
        );
    }

    render() {
        return (
            <div className="gutenberg-gallery">
                {this.state.items.map(this.renderGalleryItem)}
                {this.renderAddItem()}
            </div>
        );
    }


}

export default Gallery;
