var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
//var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var PATHS = {
    dist: path.join(__dirname, 'dist/')
  };

module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader' ] },
            { test: /\.png$/, use: [{ loader: 'url-loader', options: { limit: 8192, mimetype: 'image/jpg' } }]},
            { test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: "file-loader",
            options: {
              outputPath: "../fonts",
            } },
            { test: /\.js?$/, exclude: '/node_modules/', use: { loader: 'babel-loader' } },
            { test: /\.html$/, loader: 'raw-loader' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'Util': "exports-loader?Util!bootstrap/js/dist/util"
        }),
        new webpack.DefinePlugin( {'VERSION': JSON.stringify(pkg.version) }),
        // new UglifyJSPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        open: true,
        static: path.resolve(PATHS.dist)
    }
};
