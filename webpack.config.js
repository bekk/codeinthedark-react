const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin({
    disable: !process.env.MEASURE,
});

webpackConfig = {
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: './dist/bundle.js',
        publicPath: '/',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['cache-loader', 'awesome-typescript-loader?module=es6'],
                exclude: [/node_modules/, /public/],
            },
            {
                test: /\.js$/,
                use: 'source-map-loader',
                exclude: /node_modules/,
                enforce: 'pre',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['cache-loader', 'babel-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                    },
                    { loader: 'less-loader' },
                ],
            },
            {
                test: /\.(svg|ttf|png)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        hot: true,
        open: true,
    },
};

module.exports = smp.wrap(webpackConfig);
