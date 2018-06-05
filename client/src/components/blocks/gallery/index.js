import { Component } from '@wordpress/element';
import ReactDOM from 'react-dom';
import Image from '../image';

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.addItem = this.addItem.bind(this);
        this.renderGalleryItem = this.renderGalleryItem.bind(this);

        this.state = {
            items: props.attributes.items || [],
        };
    }

    componentDidMount() {
        if (!this.state.items.length) {
            this.addItem();
        }
    }

    addItem() {
        const items = this.state.items.slice(0);
        items.push({});
        this.setState({items});
    }

    renderGalleryItem(item, index) {
        const instanceId = this.props.instanceId;
        let setAttributes = (newData) => {
            this.updateItem(newData, index);
        };
        setAttributes = setAttributes.bind(this);

        return (
            <div className="gutenberg-gallery__item">
                <Image key={index} attributes={item} setAttributes={setAttributes} instanceId={`gallery-${instanceId}-${index}`} />
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
