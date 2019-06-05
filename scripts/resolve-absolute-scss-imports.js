const replace = require('replace-in-file');
const path = require('path');
const {
  projectRoot,
} = require('../webpack/helpers');

/**
 * This script ensures you can use ~ to reference the project dir
 * in scss imports for AoT builds as well.
 */


const options = {
  files: path.join(projectRoot('build'), '**', '*.scss'),
  from: /@import '~\/([^']+)/g,
  to: `@import '${path.join(projectRoot('./'), '$1')}`,
};

try {
  replace.sync(options);
}
catch (error) {
  console.error('Error occurred:', error);
}
