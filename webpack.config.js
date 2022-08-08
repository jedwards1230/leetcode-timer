const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        content_script: path.resolve(__dirname, "src/contentScript.ts"),
        popup: path.resolve(__dirname, "src/popup.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", "js", "tsx"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "assets/"),
                    to: path.resolve(__dirname, "dist/"),
                },
                {
                    from: path.resolve(
                        __dirname, "node_modules/webextension-polyfill/dist/browser-polyfill.js"
                    ),
                    to: path.resolve(__dirname, "dist"),
                }
            ],
        }),
    ],
};