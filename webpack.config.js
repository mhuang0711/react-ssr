const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
// const baseConfig = {
//     test: /\.js$/,
//     exclude: /node_modules/,
//     use: {
//         loader: 'babel-loader',
//         options: {
//             presets: ['env', 'react']
//             //   plugins: ['transform-class-properties']
//         }
//     }
// }
// const serverConfig = {
//     mode: 'development',
//     target: 'node',
//     node: {
//         __dirname: false
//     },
//     externals: nodeExternals(),
//     entry: ['babel-polyfill', './src/server.js'],
//     // entry: './src/server.js',
//     module: {
//         rules: [baseConfig]
//     },
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'server.js',
//         publicPath: '/'
//     },


// }
// const clientConfig = {
//     mode: 'development',
//     target: 'web',
//     entry: {
//         'index.js': path.resolve(__dirname, 'src/client/index.js')
//     },
//     module: {
//         rules: [baseConfig]
//     },
//     output: {
//         path: path.resolve(__dirname, 'dist/client'),
//         filename: '[name]'
//     }
// }

// module.exports = [serverConfig, clientConfig];

module.exports = {
    entry: ['babel-polyfill', './src/server.js'],
    // entry: './src/server.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        publicPath: '/'
    },
    target: 'node',
    externals: nodeExternals(),
    devServer: {
        contentBase: './src/server.js',
        hot: true,
        port: 1234
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: `'production'`
            }
        })
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react']

                }
            }
        ]
    }
};