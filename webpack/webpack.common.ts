import { globalCSSImports, projectRoot } from './helpers';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
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
  }, {
    from: path.join(__dirname, '..', 'src', 'robots.txt'),
    to: path.join('robots.txt')
  }
];

const SCSS_LOADERS = [{
  loader: 'postcss-loader',
  options: {
    sourceMap: true
  }
},
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      sassOptions: {
        includePaths: [projectRoot('./')]
      }
    }
  },]

export const commonExports = {
  plugins: [
    new CopyWebpackPlugin(copyWebpackOptions),
    new HtmlWebpackPlugin({
      template: projectRoot('./src/index.html', ),
      output: projectRoot('dist'),
      inject: 'head'
    }),
    new ScriptExtPlugin({
      defaultAttribute: 'defer'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack'
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          /(_exposed)?_variables.scss$|\/src\/themes\/[^/]+\/styles\/.+.scss$/
        ],
        use: [
          ...SCSS_LOADERS,
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports()
            },
          }
        ]
      },
      {
        test: /(_exposed)?_variables.scss$|\/src\/themes\/[^/]+\/styles\/.+.scss$/,
        exclude: [/node_modules/],
        use: [
          ...SCSS_LOADERS,
        ]
      },
    ],
  }
};
