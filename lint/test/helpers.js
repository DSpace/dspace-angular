const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const StacktraceOption = require('jasmine-spec-reporter').StacktraceOption;

jasmine.getEnv().clearReporters(); // Clear default console reporter for those instead
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayErrorMessages: false,
  },
  summary: {
    displayFailed: true,
    displayStacktrace: StacktraceOption.PRETTY,
  },
}));
