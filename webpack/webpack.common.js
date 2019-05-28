const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const {
  root,
  join,
  globalCSSImports,
  themeReplaceOptions,
  theme,
  themePath
} = require('./helpers');

const srcPath = root('src');

const getThemedPath = (componentPath, ext) => {
  const parsedPath = path.parse(componentPath);
  const relativePath = path.relative(srcPath, parsedPath.dir);
  return path.join(themePath, relativePath, `${parsedPath.name}.${ext}`);
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
        test: (filePath) => {
          if (/\.component.ts$/.test(filePath)) {
            const themedStylePath = getThemedPath(filePath, 'scss');
            return fs.existsSync(themedStylePath);
          } else {
            return false;
          }
        },
        use: (info) => {
          const parsedPath = path.parse(info.resource);
          const themedStylePath = getThemedPath(info.resource, 'scss');
          console.log('themedStylePath', themedStylePath);
          return [
            'debug-loader',
            {
              loader: 'string-replace-loader',
              options: {
                search: `\.\/${parsedPath.name}\.scss`,
                replace: themedStylePath,
                flags: 'g'
              }

            }
          ]
        }
      },
      {
        test: (filePath) => {
          if (/\.component.ts$/.test(filePath)) {
            const themedTemplatePath = getThemedPath(filePath, 'html');
            return fs.existsSync(themedTemplatePath);
          } else {
            return false;
          }
        },
        use: (info) => {
          const parsedPath = path.parse(info.resource);
          const themedTemplatePath = getThemedPath(info.resource, 'html');

          return [
            'debug-loader',
            {
              loader: 'string-replace-loader',
              options: {
                search: `\.\/${parsedPath.name}\.html`,
                replace: themedTemplatePath,
                flags: 'g'
              }

            }
          ]
        }
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
      from: join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
      to: join('assets', 'fonts')
    }, {
      from: join(__dirname, '..', 'resources', 'images'),
      to: join('assets', 'images')
    }, {
      from: join(__dirname, '..', 'resources', 'i18n'),
      to: join('assets', 'i18n')
    }
    ])
  ]
};
