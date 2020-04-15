

class BlockTypeNotFound extends Error {
    constructor(blockType) {
        super(`Unable to find block type ${blockType}`);
    }
}

export default BlockTypeNotFound;
