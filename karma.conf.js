/**
 * @author: @AngularClass
 */

module.exports = function (config) {

  var testWebpackConfig = require('./webpack/webpack.test.js')({
    env: 'test'
  });

  // Uncomment and change to run tests on a remote Selenium server
  var webdriverConfig = {
    hostname: 'localhost',
    port: 4444
  };

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-webdriver-launcher'),
      require('karma-coverage'),
      require('karma-remap-coverage'),
      require('karma-mocha-reporter'),
      require('karma-remap-istanbul'),
      require('karma-sourcemap-loader'),
      require("istanbul-instrumenter-loader"),
      require("karma-istanbul-preprocessor")
    ],

    // list of files to exclude
    exclude: [],

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [{
      pattern: './spec-bundle.js',
      watched: false
    }],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      './spec-bundle.js': ['istanbul', 'webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    // save interim raw coverage report in memory
    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null, // to show summary in console
      html: './coverage/html',
      cobertura: './coverage/cobertura.xml'
    },

    remapIstanbulReporter: {
      remapOptions: {}, //additional remap options
      reports: {
        json: 'coverage/coverage.json',
        lcovonly: 'coverage/lcov.info',
        html: 'coverage/html/',
      }
    },

    /**
     * Webpack please don't spam the console when running in karma!
     */
    webpackMiddleware: {
      /**
       * webpack-dev-middleware configuration
       * i.e.
       */
      noInfo: true,
      /**
       * and use stats to turn off verbose output
       */
      stats: {
        /**
         * options i.e.
         */
        chunks: false
      }
    },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha', 'coverage', 'remap-coverage', 'karma-remap-istanbul'],

    // Karma web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'Chrome'
    ],

    customLaunchers: {
      // Continuous integraation with Chrome - launcher
      'ChromeTravisCi': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      // Remote Selenium Server with Chrome - launcher
      'SeleniumChrome': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome'
      },
      // Remote Selenium Server with Firefox - launcher
      'SeleniumFirefox': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'firefox'
      }
    },

    mochaReporter: {
      ignoreSkipped: true
    },

    browserNoActivityTimeout: 30000

  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCi'];
  }

  config.set(configuration);
};
