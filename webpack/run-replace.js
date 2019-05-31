const replace = require('replace-in-file');
const {
  projectRoot,
} = require('./helpers');

/**
 * This script ensures you can use ~ to reference the project dir
 * in scss imports for AoT builds as well.
 */


const options = {
  files: projectRoot('build') + '/**/*.scss',
  from: /@import '~\//g,
  to: `@import '${projectRoot('./')}/`,
};

try {
  replace.sync(options);
}
catch (error) {
  console.error('Error occurred:', error);
}
