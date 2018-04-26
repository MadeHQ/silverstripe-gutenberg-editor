import React, { Component } from 'react';
import Header from './Header';
import BlockList from './BlockList';

// import { inject } from 'lib/Injector';
// import { compose } from 'redux';
// import fieldHolder from 'components/FieldHolder/FieldHolder';

class GutenbergEditor extends Component {
  render() {
    const props = this.props;
    return (
      <div className="gutenburg-wrapper">
        <Header />
        <BlockList {...props} />
      </div>
    );
  }
}

export default GutenbergEditor;
// console.log('inject, fieldHolder', inject, fieldHolder);
// export default compose(
//   inject([GutenbergEditor]),
//   fieldHolder
// )(GutenbergEditor);
