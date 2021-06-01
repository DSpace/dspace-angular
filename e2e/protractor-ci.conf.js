const config = require('./protractor.conf').config;

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--no-sandbox', '--disable-gpu']
    }
};

// don't use protractor's webdriver, as it may be incompatible with the installed chrome version
config.directConnect = false;
config.seleniumAddress = 'http://localhost:4444/wd/hub';

exports.config = config;
