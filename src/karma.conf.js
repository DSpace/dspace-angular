// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      },
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      subdir: '.',
      reporters: [
            { type: 'html' },
            { type: 'text-summary' }
      ],
      fixWebpackSourcePaths: true
    },
    files: [
      { pattern: './assets/**', watched: false, included:false, nocache:false, served:true },
    ],
    proxies: {
        '/assets/': '/base/src/assets/'
    },
    reporters: ['spec', 'kjhtml'],
    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: true, // do not print information about skipped tests
      showSpecTiming: false, // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['CustomChromeHeadless'],
    singleRun: false,
    captureTimeout:120000,
    browserNoActivityTimeout: 65000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 65000,
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'Chrome',
        flags: ['--no-sandbox',
                '--headless',
                '--no-proxy-server',
                '--disable-web-security',
                '--disable-gpu',
                '--disable-translate',
                '--disable-extensions',
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                '--remote-debugging-port=9250',
                '--js-flags=--max-old-space-size=8192'],
      },
    },
    browserConsoleLogOptions: {
      level: 'log',
      terminal: true,
    }
  });
};
