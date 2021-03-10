const path = require('path');

export const projectRoot = (relativePath) => {
  return path.resolve(__dirname, '..', relativePath);
};

export const globalCSSImports = () => {
  return [
    projectRoot('src/styles/_variables.scss'),
    projectRoot('src/styles/_mixins.scss'),
  ];
};


module.exports = {
  projectRoot,
  globalCSSImports
};
