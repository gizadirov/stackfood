const fs = require('fs')
const path = require('path')
const webpack = require('webpack');

module.exports = {
    devServer: {
        host: "localhost",
        port: 5002
    },
    configureWebpack: {
        plugins: [  new webpack.ProvidePlugin({ $: "jquery" }) ]
    },
    chainWebpack: (config) => {

        config.externals({
            'jquery': 'jQuery'
        })
    }
}