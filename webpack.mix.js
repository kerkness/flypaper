// Require env
require('dotenv').config(); 

const webpack = require('webpack');
const mix = require('laravel-mix');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// console.log(process.env.UPPY_SERVERLESS);


 const dotenvplugin = new webpack.DefinePlugin({
    'process.env': {
        APP_NAME: JSON.stringify(process.env.APP_NAME || 'Default app name'),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        IMGIX_URL: JSON.stringify(process.env.IMGIX_URL || ''),
        AWS_POST_END_POINT: JSON.stringify(process.env.AWS_POST_END_POINT || ''),
    }
})

 mix.webpackConfig(webpack => {
    return {
        plugins: [
            new NodePolyfillPlugin(),
            dotenvplugin,
        ]
    };
});

mix.js('resources/js/app.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css');

