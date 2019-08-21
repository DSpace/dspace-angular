const syncBuildDir = require('copyfiles');
const path = require('path');
const {
  projectRoot,
  theme,
  themePath,
} = require('../webpack/helpers');

const projectDepth = projectRoot('./').split(path.sep).length;

let callback;

if (theme !== null && theme !== undefined) {
  callback = () => {
    syncBuildDir([path.join(themePath, '**/*'), 'build'], { up: projectDepth + 2 }, () => {})
  }
}
else {
  callback = () => {};
}

syncBuildDir([projectRoot('src/**/*'), 'build'], { up: projectDepth + 1 }, callback);
