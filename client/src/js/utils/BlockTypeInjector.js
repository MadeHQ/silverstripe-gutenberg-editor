import find from 'lodash/find';
import BlockTypeNotFound from '../errors/BlockTypeNotFound';

const blockTypes = [];

export function addBlockType(component)
{
    const index = componentIndexById(componentId);
    if (index < 0) {
        blockTypes.push(component);
    } else {
        blockTypes.splice(index, 1, component);
    }
}

export function removeBlockType(componentId) {
    const index = componentIndexById(componentId);
    if (index >= 0) {
        blockTypes.splice(index, 1);
    } else {
        throw BlockTypeNotFound(componentId);
    }
}

export function getBlockByType(componentId) {
    const index = componentIndexById(componentId);
    if (index >= 0) {
        return blockTypes[index];
    }
    throw BlockTypeNotFound(componentId);
}

export function listBlockTypes() {
    return blockTypes.map(component => {
        return component.Id;
    });
}

export function listBlocks() {
    return Object.assign([], blockTypes);
}

function componentIndexById(componentId) {
    return blockTypes.findIndex(testComponent => {
        return testComponent.Id === componentId;
    })
}
