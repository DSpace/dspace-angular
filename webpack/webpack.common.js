const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const {
    root,
    join
} = require('./helpers');

// const theme = '';
// const themeFolder = '';
const theme = 'mantis';
const themeFolder = 'themes';


const themeReplaceOptions =
        {
            multiple: [
                {
                    search: '$theme$.',
                    replace: theme + (theme.length ? '.' : ''),

                },
                {
                    search: '$themePath$/',
                    replace: themeFolder + (themeFolder.length ? '/' : ''),

                },
                {
                    search: '$theme$.',
                    replace: theme + (theme.length ? '.' : ''),

                },
                {
                    search: '$themePath$/',
                    replace: themeFolder + (themeFolder.length ? '/' : ''),
                }
            ]
        };
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
                test: /\.component.ts$/,
                loader: 'string-replace-loader',
                options: themeReplaceOptions
            },
            {
                test: /styles\/_variables_imports.scss$/,
                enforce: 'pre',
                use: [
                    'debug-loader',
                    {
                        loader: 'string-replace-loader',
                        options: themeReplaceOptions
                    },
                ]

            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: themeReplaceOptions
                    },
                ]

            },
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
                        loader: 'string-replace-loader',
                        options:
                                {
                                    search: 'theme\.',
                                    replace: theme + (theme.length ? '\.' : ''),
                                }
                    },
                    {
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
                    'debug-loader',
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
        }, {
            from: join(__dirname, '..', 'src', 'styles', '_variables_imports.scss'),
            to: join(__dirname, '..', 'src', 'styles', '_variables.scss')
        }])
    ]

};
