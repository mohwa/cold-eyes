/**
 * Created by mohwa on 2018. 2. 14..
 */

const path = require('path');
const fs = require('fs');

const {Config, environment} = require('webpack-config');

const envConfig = environment.get('config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const buildPath = path.join(rootPath, 'dist');

const entry = path.join(srcPath, 'cold-eyes');

const config = {
    entry: {
        "cold-eyes": entry
    },
    devServer: {
        host: 'localhost',
        port: '8088',
        open: true
    },
    plugins: [
        new WriteFilePlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            inject: 'head',
            template: path.join(srcPath, 'index.html')
        })
    ]
};

module.exports = new Config().extend(path.join(__dirname, 'webpack.base.config.js')).merge(config);