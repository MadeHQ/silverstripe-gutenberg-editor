import React, {
    Component
} from 'react';

class GutenbergEditor extends Component {
    constructor(props) {
        super(props);
        this.manager = props.blockManager;
    }

    renderBlocks() {
console.log(this.manager.getBlockOrder());
        return 'renderBlocks';
    }

    render() {
        return (<div>
            {this.renderBlocks()}
        </div>);
    }
}

export default GutenbergEditor;



// import React, {
//     Component
// } from 'react';
// import Header from './Header';
// import BlockList from './BlockList';
// import guid from './lib/GuidGenerator';
//
// import {
//     addBlock,
//     getBlock
// } from './BlockInjector';
//
// export {
//     addBlock,
//     getBlock
// };
//
// class GutenbergEditor extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             blockData: {
//                 blockOrder: props.blockOrder || [],
//                 blocks: props.blocks || {}
//             }
//         };
//         this.state.history = [];
//         this.state.future = [];
//     }
//
//     addBlock(newBlock, beforeBlock) {
//         const newBlockData = this.state.blockData;
//         const id = guid();
//         newBlock.id = id;
//         newBlockData.blocks[id] = newBlock;
//         if (beforeBlock) {
//             let index = newBlockData.blockOrder.indexOf(beforeBlock);
//             newBlockData.blockOrder.splice(index, 0, newBlock);
//         } else {
//             newBlockData.blockOrder.push(id);
//         }
//
//         this.setState({
//             newBlockData
//         });
//     }
//
//     setState(state) {
//         console.log('setState', state, this.state);
//         debugger;
//         super.setState(state);
//         this.props.onChange(this.state.blockData);
//     }
//
//     onChange(updatedBlock) {
//         const oldData = Object.assign({}, this.state.blockData);
//         const blocks = Object.assign({}, oldData.blocks);
//         const history = Object.assign({}, this.state.history);
//         blocks[updatedBlock.id] = updatedBlock;
//         const blockOrder = this.state.blockData.blockOrder;
//
//         history.push(oldData);
//
//         this.setState({
//             history,
//             blockData: {
//                 blocks,
//                 blockOrder
//             }
//         });
//
//         // // console.log(JSON.stringify(this.state.blockData));
//         // // debugger;
//         //     const oldData = this.state.blockData;
//         //
//         //     const blocks = Object.assign({}, oldData.blocks);
//         //     const history = Object.assign({}, this.state.history);
//         //     history.push(oldData);
//         //     const blockOrder = this.state.blockData.blockOrder;
//         //     blocks[updatedBlock.id] = updatedBlock;
//         //
//         //     this.setState({
//         //       history,
//         //       blockData: {blocks, blockOrder}
//         //     });
//     }
//
//     onUndo() {
//         const history = this.state.history;
//         const future = this.state.future;
//         const blockData = history.pop();
//         future.push(this.state);
//         this.setState({
//             history,
//             future,
//             blockData
//         });
//         console.log('GutenbergEditor::onUndo');
//     }
//
//     onRedo() {
//         const history = this.state.history;
//         const future = this.state.future;
//         const blockData = future.pop();
//         history.push(this.state);
//         this.setState({
//             history,
//             future,
//             blockData
//         });
//         console.log('GutenbergEditor::onRedo');
//     }
//
//     render() {
//         const blockData = Object.assign({}, this.state.blockData);
//         const addBlock = this.addBlock.bind(this);
//         const onChange = this.onChange.bind(this);
//         const onUndo = this.onUndo.bind(this);
//         const onRedo = this.onRedo.bind(this);
//         console.log('GutenbergEditor::render', 'history', this.state.history, 'future', this.state.future);
//         return ( <
//             div className = "gutenburg-wrapper" >
//             <Header
//                 addBlock={addBlock}
//                 onUndo={onUndo}
//                 allowUndo = {!this.state.history.length}
//                 onRedo={onRedo}
//                 allowRedo={!this.state.future.length}
//             />
//             <BlockList
//                 onChange={onChange}
//                 {...blockData}
//             /> <
//             /div>
//         );
//     }
// }
//
// export default GutenbergEditor;
// // console.log('inject, fieldHolder', inject, fieldHolder);
// // export default compose(
// //   inject([GutenbergEditor]),
// //   fieldHolder
// // )(GutenbergEditor);
