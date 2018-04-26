const config = require('@silverstripe/webpack-config/.eslintrc');

config.rules['react/prefer-stateless-function'] = 'off';

module.exports = config;
