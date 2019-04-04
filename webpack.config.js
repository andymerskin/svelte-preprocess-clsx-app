const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');
const { sveltePreprocessClsx } = require('svelte-preprocess-clsx');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: [/node_modules/, /index.html/],
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true,
						preprocess: sveltePreprocess({
							transformers: {
								clsx: sveltePreprocessClsx()
							}
						})
					}
				}
			},
			{
				test: /\.s?css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							localIdentName: '[local]-[hash:base64:5]'
						}
					},
					'sass-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	],
	devtool: prod ? false: 'source-map'
};
