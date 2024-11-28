const { ModuleFederationPlugin } = require('webpack').container;
const DefinePlugin = require('webpack').DefinePlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                './*.html',
                './*.css',
                './lib/**',
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
            APP_URL: JSON.stringify('http://localhost:8083')
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
    if (isProduction) {
        config.mode = 'production';

    } else {
        config.mode = 'development';
    }
    return config;
};
