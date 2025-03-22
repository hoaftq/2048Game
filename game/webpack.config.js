const { ModuleFederationPlugin } = require('webpack').container;
const DefinePlugin = require('webpack').DefinePlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './start.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    experiments: {
        outputModule: true
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                test: /\.js$/,
                exclude: /\.mjs$/,
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                './*.html',
                './*.css',
                './lib/**',
                './mfe/**',
                {
                    from: "./*.js",
                    globOptions: {
                        ignore: ['**/webpack.config.js'],
                    }
                }],
        }),
        new ModuleFederationPlugin({
            name: 'game-2048',
            filename: 'remoteEntry.js',
            library: {
                type: 'module'
            },
            exposes: {
                './game-2048': './mfe/game-2048.js'
            }
        }),
        new DefinePlugin({
            APP_URL:  isProduction
                      ? 'https://d25teof8rvvecp.cloudfront.net'
                      : 'http://localhost:8083'
        })
    ],
    module: {
    },
    devServer: {
        static: './dist',
        port: 8083,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};

module.exports = () => {
    config.mode =  isProduction ? 'production' : 'development';
    return config;
};
