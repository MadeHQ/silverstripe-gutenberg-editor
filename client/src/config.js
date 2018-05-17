import { get, extend, isEmpty } from 'lodash';

const defaultConfig = {
    blocks: {
        paragraph: {
            textAlignment: true,
            dropCap: true,
            fontSize: false,
            backgroundColor: false,
            textColor: false,
            blockAlignment: false,
            personalisation: true,
        },
        embed: {
            blockAlignment: false,
            caption: true,
            personalisation: true,
        },
        list: {
            personalisation: true,
        },
        heading: {
            className: false,
            anchor: true,
            textAlignment: false,
            personalisation: true,
        },
        pullquote: {
            personalisation: true,
        },
        quote: {
            personalisation: true,
        },
        code: {
            personalisation: true,
        },
        html: {
            personalisation: true,
        },
        table: {
            personalisation: true,
        },
        separator: {
            personalisation: true,
        },
    },
    oembed: null,
    personalisation: [],
};

let configCache = null;

function getConfig() {
    if (!configCache) {
        configCache = defaultConfig;
    }

    return configCache;
}

export function setConfig(config) {
    if (isEmpty(config)) {
        return false;
    }

    configCache = extend({}, defaultConfig, config || {});
}

export function isBlockFeatureEnabled(block, feature) {
    const config = getConfig();

    block = block.replace('core/', '');

    let blockConfig = get(config.blocks, block, false);

    if (!blockConfig) {
        return false;
    }

    return get(blockConfig, feature, true);
}

export function getConfigValue(name, fallback = null) {
    return get(getConfig(), name, fallback);
}

export default getConfig;
