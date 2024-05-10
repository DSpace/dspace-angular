# ESLint testing fixtures

The files in this directory are used for the ESLint testing environment
- Some rules rely on registries that must be built up _before_ the rule is run
  - In order to test these registries, the fixture sources contain a few dummy components
- The TypeScript ESLint test runner requires at least one dummy file to exist to run any tests
  - By default, [`test.ts`](./src/test.ts) is used. Note that this file is empty; it's only there for the TypeScript configuration, the actual content is injected from the `code` property in the tests.
  - To test rules that make assertions based on the path of the file, you'll need to include the `filename` property in the test configuration. Note that it must point to an existing file too!
  - The `filename` must be provided as `fixture('src/something.ts')`