import { globalCSSImports, projectRoot } from './helpers';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const sass = require('sass');

export const copyWebpackOptions = {
  patterns: [
    {
      from: path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts'),
      to: path.join('assets', 'fonts'),
      force: undefined
    },
    {
      from: path.join(__dirname, '..', 'src', 'assets'),
      to: 'assets',
    },
    {
      // replace(/\\/g, '/') because glob patterns need forward slashes, even on windows:
      // https://github.com/mrmlnc/fast-glob#how-to-write-patterns-on-windows
      from: path.join(__dirname, '..', 'src', 'themes', '*', 'assets', '**', '*').replace(/\\/g, '/'),
      noErrorOnMissing: true,
      to({ absoluteFilename }) {
        // use [\/|\\] to match both POSIX and Windows separators
        const matches = absoluteFilename.match(/.*[\/|\\]themes[\/|\\]([^\/|^\\]+)[\/|\\]assets[\/|\\](.+)$/);
        if (matches) {
          // matches[1] is the theme name
          // matches[2] is the rest of the path relative to the assets folder
          // e.g. themes/custom/assets/images/logo.png will end up in assets/custom/images/logo.png
          return path.join('assets', matches[1], matches[2]);
        }
      },
    },
    {
      from: path.join(__dirname, '..', 'src', 'robots.txt'),
      to: 'robots.txt'
    }
  ]
};

const SCSS_LOADERS = [
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      // sass >1.33 complains about deprecation warnings in Bootstrap 4
      // After upgrading to Angular 12 we need to explicitly use an older version here
      // todo: remove after upgrading to Bootstrap 5
      implementation: sass,
      sassOptions: {
        includePaths: [projectRoot('./')]
      }
    }
  },
];

export const commonExports = {
  plugins: [
    new CopyWebpackPlugin(copyWebpackOptions),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack'
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          /(_exposed)?_variables.scss$|[\/|\\]src[\/|\\]themes[\/|\\].+?[\/|\\]styles[\/|\\].+\.scss$/
        ],
        use: [
          ...SCSS_LOADERS,
          {
            loader: 'sass-resources-loader',
            options: {
              resources: globalCSSImports()
            },
          }
        ]
      },
      {
        test: /(_exposed)?_variables.scss$|[\/|\\]src[\/|\\]themes[\/|\\].+?[\/|\\]styles[\/|\\].+\.scss$/,
        exclude: [/node_modules/],
        use: [
          ...SCSS_LOADERS,
        ]
      },
    ],
  },
};
