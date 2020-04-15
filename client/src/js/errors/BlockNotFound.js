

class BlockNotFound extends Error {
    constructor(block) {
        super(`Unable to find block ${block.id}`);
    }
}

export default BlockNotFound;
