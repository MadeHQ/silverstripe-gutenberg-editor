import { get, extend, isEmpty } from 'lodash';

const defaultConfig = {
    blocks: {
        paragraph: {
            textAlignment: false,
            dropCap: false,
            fontSize: false,
            backgroundColor: false,
            textColor: false,
            blockAlignment: false,
            personalisation: false,
        },
        lede: {
            dropCap: false,
        },
        embed: {
            blockAlignment: false,
            caption: true,
            personalisation: false,
        },
        list: {
            personalisation: false,
        },
        heading: {
            className: false,
            anchor: true,
            textAlignment: false,
            personalisation: false,
        },
        pullquote: {
            personalisation: false,
        },
        quote: {
            personalisation: false,
        },
        code: {
            personalisation: false,
        },
        html: {
            personalisation: false,
        },
        table: {
            personalisation: false,
        },
        separator: {
            personalisation: false,
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
