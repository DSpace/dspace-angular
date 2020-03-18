import { buildRoot, globalCSSImports, projectRoot, theme, themedTest, themedUse, themePath } from './helpers';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');

export const copyWebpackOptions = [
  {
    from: path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
    to: path.join('assets', 'fonts'),
    force: undefined
  },
  {
    from: path.join(__dirname, '..', 'src', 'assets', 'fonts'),
    to: path.join('assets', 'fonts')
  }, {
    from: path.join(__dirname, '..', 'src', 'assets', 'images'),
    to: path.join('assets', 'images')
  }, {
    from: path.join(__dirname, '..', 'src', 'assets', 'i18n'),
    to: path.join('assets', 'i18n')
  }
  ];

export const commonExports = {
  target: 'web',
  plugins: [
    new CopyWebpackPlugin(copyWebpackOptions),
    new HtmlWebpackPlugin({
      template: buildRoot('./index.html', ),
      output: projectRoot('dist'),
      inject: 'head'
    }),
    new ScriptExtPlugin({
      defaultAttribute: 'defer'
    })
  ],
  node: {
    module: 'empty'
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
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          buildRoot('styles/_exposed_variables.scss'),
          buildRoot('styles/_variables.scss')
        ],
        use: [
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
              resources: globalCSSImports()
            },
          }
        ]
      },
      {
        test: /(_exposed)?_variables.scss$/,
        exclude: [/node_modules/],
        use: [
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
    ],
  }
};

module.exports = commonExports;
