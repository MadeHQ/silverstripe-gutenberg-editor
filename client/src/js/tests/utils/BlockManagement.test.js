import * as BlockManagement from '../../utils/BlockManagement';

test('', () => {
    console.log(BlockManagement.getBlockOrder());
});

// import find from 'lodash/find';
// import BlockNotFound from '../errors/BlockNotFound';
//
// const blocks = [];
// const blockOrder = [];
//
// /**
//  *
//  */
// export function addBlock(blockData, beforeId) {
//     if (beforeId) {
//         const index = getBlockOrderIndexById(beforeId);
//         if (index >= 0) {
//             blockOrder.splice(index, 0, blockData.Id);
//         } else {
//             throw BlockNotFound(beforeId);
//         }
//     } else {
//         blockOrder.push(blockData.Id);
//     }
//     blocks.push(blockData);
// }
//
// /**
//  *
//  */
// export function removeBlock(id) {
//     const blockIndex = getBlockIndexById(id);
//     const blockOrderIndex = getBlockOrderIndexById(id);
//     if (blockIndex >= 0 && blockOrderIndex >= 0) {
//         blocks.splice(blockIndex, 1);
//         blockOrder.splice(blockOrderIndex, 1);
//     } else {
//         throw BlockNotFound(id);
//     }
// }
//
// /**
//  *
//  */
// export function getBlock(id) {
//     const blockIndex = getBlockIndexById(id);
//     if (blockIndex >= 0) {
//         return blocks[blockIndex];
//     }
//     throw BlockNotFound(id);
// }
//
// /**
//  *
//  */
// export function getBlockOrder() {
//     return Object.assign([], blockOrder);
// }
//
// /**
//  *
//  */
// export function moveBlockUp(id) {
//     console.log('BlockManagement::moveBlockUp', id);
// }
//
// /**
//  *
//  */
// export function moveBlockDown(id) {
//     console.log('BlockManagement::moveBlockDown', id);
// }
//
// function getBlockOrderIndexById(blockId) {
//     return blockOrder.findIndex(testBlockId => {
//         return tetBlockId === blockId;
//     })
// }
//
// function getBlockIndexById(blockId) {
//     return blocks.findIndex(testBlock => {
//         return tetBlock.Id === blockId;
//     })
// }
