const path = require('path');
const fs = require('fs');


const projectRoot = (relativePath) => {
  return path.resolve(__dirname, '..', relativePath);
};

const srcPath = projectRoot('src');

const buildRoot = (relativePath, env) => {
  if (env.aot) {
    return path.resolve(projectRoot('./build'), relativePath);
  } else {
    return path.resolve(projectRoot('src'), relativePath);
  }
};

//TODO refactor to share between this and config.ts.
const getThemeName = () => {
  let defaultCfg = require(projectRoot('config/environment.default.js'));
  let envConfigFile;
  let envConfigOverride = {};

  switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
      // webpack.prod.dspace-angular-config.ts defines process.env.NODE_ENV = 'production'
      envConfigFile = projectRoot('config/environment.prod.js');
      break;
    case 'test':
      // webpack.test.dspace-angular-config.ts defines process.env.NODE_ENV = 'test'
      envConfigFile = projectRoot('config/environment.test.js');
      break;
    default:
      // if not using webpack.prod.dspace-angular-config.ts or webpack.test.dspace-angular-config.ts, it must be development
      envConfigFile = projectRoot('config/environment.dev.js');
  }

  if (envConfigFile) {
    try {
      envConfigOverride = require(envConfigFile);
    } catch (e) {
    }
  }

  return Object.assign({}, defaultCfg.theme, envConfigOverride.theme).name;
}

const theme = getThemeName();

let themePath;

if (theme !== null && theme !== undefined) {
  themePath = path.normalize(path.join(__dirname, '..', 'themes', theme));
}
else {
  themePath = srcPath;
}

const globalCSSImports = (env) => { return [
  buildRoot('styles/_variables.scss', env),
  buildRoot('styles/_mixins.scss', env),
]};

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
  ]
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
