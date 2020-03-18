const path = require('path');
const fs = require('fs');
const environment = require('../src/environments/environment.ts').environment;

export const projectRoot = (relativePath) => {
  return path.resolve(__dirname, '..', relativePath);
};

export const srcPath = projectRoot('src');

export const buildRoot = (relativePath) => {
  if (environment.aot) {
    return path.resolve(projectRoot('./build'), relativePath);
  } else {
    return path.resolve(projectRoot('src'), relativePath);
  }
};

export const theme = environment.theme.name;

export let themePath;

if (theme !== null && theme !== undefined) {
  themePath = path.normalize(path.join(__dirname, '..', 'themes', theme));
} else {
  themePath = srcPath;
}

export const globalCSSImports = () => {
  return [
    buildRoot('styles/_variables.scss'),
    buildRoot('styles/_mixins.scss'),
  ];
};

const getThemedPath = (componentPath, ext) => {
  const parsedPath = path.parse(componentPath);
  const relativePath = path.relative(srcPath, parsedPath.dir);
  return path.join(themePath, relativePath, `${parsedPath.name}.${ext}`);
};

export const themedTest = (origPath, extension) => {
  if (/\.component.ts$/.test(origPath)) { // only match components
    const themedPath = getThemedPath(origPath, extension);
    return fs.existsSync(themedPath);
  } else {
    return false;
  }
};

export const themedUse = (resource, extension) => {
  const origPath = path.parse(resource);
  let themedPath = getThemedPath(resource, extension);

  /* Make sure backslashes are escaped twice, because the replace unescapes those again */
  themedPath = themedPath.replace(/\\/g, '\\\\');

  return [
    {
      loader: 'string-replace-loader',
      options: {
        search: `\.\/${origPath.name}\.${extension}`,
        replace: themedPath,
        flags: 'g'
      }
    }
  ];
};

module.exports = {
  projectRoot,
  buildRoot,
  theme: theme,
  themePath,
  getThemedPath,
  themedTest,
  themedUse,
  globalCSSImports
};
