const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const {
  projectRoot,
  buildRoot,
  globalCSSImports,
  themeReplaceOptions,
  themePath,
  themedTest,
  themedUse
} = require('./helpers');

module.exports = {
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
          buildRoot('styles/_exposed_variables.scss'),
          buildRoot('styles/_variables.scss')
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
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [path.join(themePath, 'styles')]
            }
          },
          'debug-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports
            },
          },
          {
            loader: 'string-replace-loader',
            options: themeReplaceOptions
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
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [path.join(themePath, 'styles')]
            }
          },
          {
            loader: 'string-replace-loader',
            options: themeReplaceOptions
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
      to: path.join('assets', 'fonts')
    }, {
      from: path.join(__dirname, '..', 'resources', 'images'),
      to: path.join('assets', 'images')
    }, {
      from: path.join(__dirname, '..', 'resources', 'i18n'),
      to: path.join('assets', 'i18n')
    }
    ])
  ]
};
