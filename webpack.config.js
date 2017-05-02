var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.scss$/, use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader'] 
            }) },
        ],
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
    },
    devtool: "cheap-module-eval-source-map",
};
