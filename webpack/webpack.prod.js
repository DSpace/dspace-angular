const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const {
  root
} = require('./helpers');

module.exports = {
  recordsOutputPath: root('webpack.records.json'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.AOT': true
    }),

    // Loader options
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // change it to `server` to view bundle stats
      reportFilename: 'report.html',
      generateStatsFile: true,
      statsFilename: 'stats.json',
    }),

    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: false,
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: false,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: true
      },
      sourceMap: true
    }),

    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })

  ]
};
