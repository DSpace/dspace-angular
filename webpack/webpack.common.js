const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const {
    root,
    join
} = require('./helpers');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        path: root('dist')
    },
    watchOptions: {
        aggregateTimeout: 50,
    },
    node: {
        fs: "empty",
        module: "empty"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'to-string-loader',
                    options: {
                        sourceMap: true
                    }
                },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: [/node_modules/,
                    path.resolve(__dirname, '..', 'src/styles/_exposed_variables.scss')
                ],
                use: [
                    {
                        loader: 'to-string-loader',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'raw-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'webpack-import-glob-loader'
                ]
            },
            {
                test: /_exposed_variables.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
            to: join('assets', 'fonts')
        }, {
            from: join(__dirname, '..', 'resources', 'images'),
            to: join('assets', 'images')
        }, {
            from: join(__dirname, '..', 'resources', 'i18n'),
            to: join('assets', 'i18n')
        }])
    ]

};
