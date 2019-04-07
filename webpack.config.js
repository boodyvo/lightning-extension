const path = require('path');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV !== 'production';

const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = path.join(__dirname, 'src');

module.exports = {
    mode: isDev ? 'development' : 'production',
    name: 'client',
    target: 'web',
    devtool: 'cheap-module-inline-source-map',
    entry: {
        content: path.join(__dirname, 'src/content/index.js'),
        inpage: path.join(__dirname, 'src/inpage/index.js'),
        background: path.join(__dirname, 'src/background/index.js'),
    },
    output: {
        path: path.join(__dirname, isDev ? 'dist-dev' : 'dist-prod'),
        filename: '[name].js',
        publicPath: '/',
        chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [src, path.join(__dirname, 'node_modules')],
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'static/*', flatten: true }]),
        new CopyWebpackPlugin([{ from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', flatten: true }]),
        // isDev && new CopyWebpackPlugin([{
        //     from: 'manifest.json',
        //     force: true,
        // }]),
    ]
};
