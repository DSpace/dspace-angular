const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
  root,
  join
} = require('./helpers');

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    path: root('dist')
  },
  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    }, {
      test: /\.ts$/,
      loader: '@ngtools/webpack'
    }, {
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
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [{
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
            sourceMap: true
          }
        }
      ]
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: join(__dirname, '..', 'node_modules', 'font-awesome', 'fonts'),
      to: join('assets', 'fonts')
    }, {
      from: join(__dirname, '..', 'resources', 'images'),
      to: join('assets', 'images')
    }, {
      from: join(__dirname, '..', 'resources', 'data'),
      to: join('assets', 'data')
    }, {
      from: join(__dirname, '..', 'resources', 'i18n'),
      to: join('assets', 'i18n')
    }])
  ]

};
