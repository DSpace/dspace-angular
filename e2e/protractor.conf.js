// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  allScriptsTimeout: 600000,
  // -----------------------------------------------------------------
  // Uncomment to run tests using a remote Selenium server
  //seleniumAddress: 'http://selenium.address:4444/wd/hub',
  // Change to 'false' to run tests using a remote Selenium server
  directConnect: true,
  // Change if the website to test is not on the localhost
  baseUrl: 'http://localhost:4000/',
  // -----------------------------------------------------------------
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  // -----------------------------------------------------------------
  // Browser and Capabilities: PhantomJS
  // -----------------------------------------------------------------
  //   capabilities: {
  //     'browserName': 'phantomjs',
  //     'version': '',
  //     'platform': 'ANY'
  //   },
  // -----------------------------------------------------------------
  // Browser and Capabilities: Chrome
  // -----------------------------------------------------------------
  capabilities: {
    'browserName': 'chrome',
    'version': '',
    'platform': 'ANY',
    'chromeOptions': {
      'args': [ '--headless', '--disable-gpu' ]
    }
  },
  // -----------------------------------------------------------------
  // Browser and Capabilities: Firefox
  // -----------------------------------------------------------------
  //   capabilities: {
  //     'browserName': 'firefox',
  //     'version': '',
  //     'platform': 'ANY'
  //   },

  // -----------------------------------------------------------------
  // Browser and Capabilities: MultiCapabilities
  // -----------------------------------------------------------------
  //multiCapabilities: [
  //    {
  //      'browserName': 'phantomjs',
  //      'version': '',
  //      'platform': 'ANY'
  //    },
  //    {
  //      'browserName': 'chrome',
  //      'version': '',
  //      'platform': 'ANY'
  //    }
  //    {
  //      'browserName': 'firefox',
  //      'version': '',
  //      'platform': 'ANY'
  //    }
  //],

  plugins: [{
    path: '../node_modules/protractor-istanbul-plugin'
  }],

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 600000,
    print: function () {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: './e2e/tsconfig.json'
    });
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }
};
