import React, { Component } from 'react';

class BlockList extends Component {
  renderBlock(blockData) {
    return (
      <div>Rendering Block: {blockData.data}</div>
    );
  }

  render() {
    return (
      <div className="gutenburg-block-list">
        { this.props.blocks.map(this.renderBlock) }
      </div>
    );
  }
}

export default BlockList;
