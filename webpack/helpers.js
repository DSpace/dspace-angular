const path = require('path');
const fs = require('fs');


function root(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

// const theme = '';
const theme = 'mantis';

const themePath = path.normalize(path.join(__dirname, '..', 'themes', theme));

const globalCSSImports = [
  path.resolve(__dirname, '..', 'src/styles/_variables.scss'),
  path.resolve(__dirname, '..', 'src/styles/_mixins.scss'),
];

const themeReplaceOptions =
  {
    multiple: [
      {
        search: '$themePath$/',
        replace: (themePath.length ? themePath + '/' : ''),

      }
    ]
  };

const srcPath = root('src');

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
    //'debug-loader',
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
  root: root,
  theme: theme,
  getThemedPath: getThemedPath,
  themedTest: themedTest,
  themedUse: themedUse,
  globalCSSImports: globalCSSImports,
  themeReplaceOptions: themeReplaceOptions
};
