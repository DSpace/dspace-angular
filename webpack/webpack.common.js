const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const {
  projectRoot,
  globalCSSImports,
  themeReplaceOptions,
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
          {
            loader: 'string-replace-loader',
            options: themeReplaceOptions
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports
            },
          }
        ]
      },
      {
        test: /_exposed_variables.scss$/,
        exclude: /node_modules/,
        use: [{
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        },
          {
            loader: 'string-replace-loader',
            options: themeReplaceOptions
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports
            },
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
