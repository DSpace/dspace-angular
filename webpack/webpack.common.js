const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const {
    projectRoot,
    buildRoot,
    globalCSSImports,
    theme,
    themePath,
    themedTest,
    themedUse
} = require('./helpers');

module.exports = (env) => {
  let copyWebpackOptions = [{
    from: path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
    to: path.join('assets', 'fonts')
  }, {
    from: path.join(__dirname, '..', 'resources', 'fonts'),
    to: path.join('assets', 'fonts')
  }, {
    from: path.join(__dirname, '..', 'resources', 'images'),
    to: path.join('assets', 'images')
  }, {
    from: path.join(__dirname, '..', 'resources', 'i18n'),
    to: path.join('assets', 'i18n')
  }
  ];

  const themeFonts = path.join(themePath, 'resources', 'fonts');
  if(theme && fs.existsSync(themeFonts)) {
    copyWebpackOptions.push({
      from: themeFonts,
      to: path.join('assets', 'fonts')  ,
      force: true,
    });
  }

  const themeImages = path.join(themePath, 'resources', 'images');
  if(theme && fs.existsSync(themeImages)) {
    copyWebpackOptions.push({
      from: themeImages,
      to: path.join('assets', 'images')  ,
      force: true,
    });
  }

  return {
    mode: 'development',
    devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js', '.json']
        },
        output: {
            path: projectRoot('dist')
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
                    test: (filePath) => themedTest(filePath, 'scss'),
                    use: (info) => themedUse(info.resource, 'scss')
                },
                {
                    test: (filePath) => themedTest(filePath, 'html'),
                    use: (info) => themedUse(info.resource, 'html')
                },
                {
                    test: /\.ts$/,
                    loader: '@ngtools/webpack'
                },
                {
                    test: /\.css$/,
                    use: [
                        {
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
                    exclude: [
                        /node_modules/,
                        buildRoot('styles/_exposed_variables.scss', env),
                        buildRoot('styles/_variables.scss', env)
                    ],
                    use: [
                        {
                            loader: 'raw-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                includePaths: [projectRoot('./'), path.join(themePath, 'styles')]
                            }
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: globalCSSImports(env)
                            },
                        }
                    ]
                },
                {
                    test: /(_exposed)?_variables.scss$/,
                    exclude: [/node_modules/],
                    use: [
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
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                includePaths: [projectRoot('./'), path.join(themePath, 'styles')]
                            }
                        }
                    ]
                },
                {
                    test: /\.(html|eot|ttf|otf|svg|woff|woff2)$/,
                    loader: 'raw-loader'
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin(copyWebpackOptions)
        ]
    }
};
