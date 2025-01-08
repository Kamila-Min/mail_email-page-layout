const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SvgStore = require('./src/js/webpack-svgstore/dist/svgstore');

const path = require("path");
const mode = process.env.NODE_ENV;
const isProd = mode === "production";

module.exports = {
    entry: './src/index.js',
    mode,
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },

    devtool: isProd ? false : 'inline-source-map',

    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },

    devServer: {
        port: 8081,
        compress: true,
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c|le)ss$/i,
                use: [ isProd ? MiniCssExtractPlugin.loader: "style-loader", 'css-loader', "postcss-loader", "less-loader",]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|)$/i,
                loader: 'file-loader',
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                use: 'svg-sprite-loader',
            },

        ]
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/assets/images', to: 'assets/images' },
                { from: 'public/assets/icons', to: 'assets/icons' },
            ],
        }),
        ...[].concat(isProd ? [new MiniCssExtractPlugin({
            filename: "[name].css",
        })]: []),
        new SvgStore({
            path: path.resolve(__dirname, './public/assets/icons/**/*.svg'),
            fileName: 'svg-sprites.svg',
        }),
    ]
};
