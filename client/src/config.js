import { get, extend } from 'lodash';

const defaultConfig = {
    blocks: {
        paragraph: {
            textAlignment: true,
            dropCap: true,
            fontSize: false,
            backgroundColor: false,
            textColor: false,
            blockAlignment: false,
        },
        embed: {
            blockAlignment: false,
            caption: true,
        }
    },
    oembed: null,
};

let configCache = null;

function getConfig() {
    if (!configCache) {
        configCache = extend({}, defaultConfig, window.gutenbergConfig || {});
    }

    return configCache;
}

export function isBlockFeatureEnabled(block, feature) {
    const config = getConfig();

    const blockConfig = get(config.blocks, block, false);

    if (!blockConfig) {
        return false;
    }

    return get(blockConfig, feature, true);
}

export function getConfigValue(name, fallback = null) {
    return get(getConfig(), name, fallback);
}

export default getConfig;
