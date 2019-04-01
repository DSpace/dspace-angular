const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");

const {
    root
} = require('./helpers');

module.exports = {
    mode: 'production',
    recordsOutputPath: root('webpack.records.json'),
    plugins: [
        new webpack.EnvironmentPlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'AOT': true
            }
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled', // change it to `server` to view bundle stats
            reportFilename: 'report.html',
            generateStatsFile: true,
            statsFilename: 'stats.json',
        }),


        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })

    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
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
                }
            }),
            new OptimizeCSSAssetsPlugin({
              cssProcessor: cssnano,
              cssProcessorOptions: {
                discardComments: {
                  removeAll: true,
                }
              },
              safe: true
            })
        ]
    },
};
