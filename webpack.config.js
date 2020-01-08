const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "./dist/bundle.js"
        // path: path.join(__dirname, "production"),
        // publicPath: "/"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {

        rules: [
            {
                test: /\.tsx?$/,
                loader: ['awesome-typescript-loader?module=es6'],
                exclude: [/node_modules/]
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre'
            },
            {
                test: /\.(js|jsx)$/, use: "babel-loader"
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader"
                    },
                    { loader: "less-loader" }
                ]
            },
            {
                test: /\.(svg|ttf|png)$/i,
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "production"),
        hot: true
    }
};
