const path = require('path');
const fs = require('fs');


const projectRoot = (relativePath) => {
  return path.resolve(__dirname, '..', relativePath);
};

const buildRoot = (relativePath) => {
  if (process.env.DSPACE_BUILD_DIR) {
    return path.resolve(projectRoot(process.env.DSPACE_BUILD_DIR), relativePath);
  } else {
    return path.resolve(projectRoot('src'), relativePath);
  }
};

// const theme = '';
const theme = 'mantis';

const themePath = path.normalize(path.join(__dirname, '..', 'themes', theme));

const globalCSSImports = [
  buildRoot('styles/_variables.scss'),
  buildRoot('styles/_mixins.scss'),
];

const themeReplaceOptions =
  {
    multiple: [
      {
        search: '@import \'~/',
        replace: '@import \'' + projectRoot('./') + '/',
        flags: 'g'
      }
    ]
  };

const srcPath = projectRoot('src');

const getThemedPath = (componentPath, ext) => {
  const parsedPath = path.parse(componentPath);
  const relativePath = path.relative(srcPath, parsedPath.dir);
  return path.join(themePath, relativePath, `${parsedPath.name}.${ext}`);
};

const themedTest = (origPath, extension) => {
  if (/\.component.ts$/.test(origPath)) { // only match components
    const themedPath = getThemedPath(origPath, extension);
    return fs.existsSync(themedPath);
  } else {
    return false;
  }
};

const themedUse = (resource, extension) => {
  const origPath = path.parse(resource);
  const themedPath = getThemedPath(resource, extension);

  return [
    {
      loader: 'string-replace-loader',
      options: {
        search: `\.\/${origPath.name}\.${extension}`,
        replace: themedPath,
        flags: 'g'
      }
    }
  ]
};

module.exports = {
  projectRoot,
  buildRoot,
  theme,
  themePath,
  getThemedPath,
  themedTest,
  themedUse,
  globalCSSImports,
  themeReplaceOptions
};
