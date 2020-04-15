import find from 'lodash/find';
import BlockNotFound from '../errors/BlockNotFound';

export default () => {
    let blocks = [];
    let blockOrder = [];

    /**
     *
     */
    function loadBlockData(data) {
        blocks = data.blocks;
        blockOrder = data.blockOrder;
    }

    /**
     *
     */
    function addBlock(blockData, beforeId) {
        if (beforeId) {
            const index = getBlockOrderIndexById(beforeId);
            if (index >= 0) {
                blockOrder.splice(index, 0, blockData.Id);
            } else {
                throw BlockNotFound(beforeId);
            }
        } else {
            blockOrder.push(blockData.Id);
        }
        blocks.push(blockData);
    }

    /**
     *
     */
    function removeBlock(id) {
        const blockIndex = getBlockIndexById(id);
        const blockOrderIndex = getBlockOrderIndexById(id);
        if (blockIndex >= 0 && blockOrderIndex >= 0) {
            blocks.splice(blockIndex, 1);
            blockOrder.splice(blockOrderIndex, 1);
        } else {
            throw BlockNotFound(id);
        }
    }

    /**
     *
     */
    function getBlock(id) {
        const blockIndex = getBlockIndexById(id);
        if (blockIndex >= 0) {
            return blocks[blockIndex];
        }
        throw BlockNotFound(id);
    }

    /**
     *
     */
    function getBlockOrder() {
        return Object.assign([], blockOrder);
    }

    /**
     *
     */
    function moveBlockUp(id) {
        console.log('BlockManagement::moveBlockUp', id);
    }

    /**
     *
     */
    function moveBlockDown(id) {
        console.log('BlockManagement::moveBlockDown', id);
    }

    function getBlockOrderIndexById(blockId) {
        return blockOrder.findIndex(testBlockId => {
            return tetBlockId === blockId;
        })
    }

    function getBlockIndexById(blockId) {
        return blocks.findIndex(testBlock => {
            return tetBlock.Id === blockId;
        })
    }

    return {
        addBlock,
        getBlock,
        getBlockOrder,
        loadBlockData,
        moveBlockUp,
        moveBlockDown,
        removeBlock,
    }
}
