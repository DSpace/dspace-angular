const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const {
  projectRoot,
  globalCSSImports,
  cssLoaders,
  scssLoaders,
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
        use: cssLoaders
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/,
          path.resolve(__dirname, '..', 'src/styles/_exposed_variables.scss'),
          path.resolve(__dirname, '..', 'src/styles/_variables.scss')
        ],
        use: [
          ...scssLoaders,
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports
            },
          }
        ]
      },
      {
        test: /^(_exposed)?_variables.scss$/,
        exclude: /node_modules/,
        use: scssLoaders
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
