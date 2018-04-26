import React, { Component } from 'react';

class Header extends Component {
  undoHandler() {
    console.log('undoHandler Clicked', this);
  }

  redoHandler() {
    console.log('redoHandler Clicked', this);
  }

  render() {
    const undoHandler = this.undoHandler.bind(this);
    const redoHandler = this.redoHandler.bind(this);

    return (
      <div className="gutenburg-wrapper">
        <button
          onClick={undoHandler}
          className="header-undo"
        >
          Undo
        </button>
        <button
          onClick={redoHandler}
          className="header-redo"
        >
          Redo
        </button>
      </div>
    );
  }
}

export default Header;
