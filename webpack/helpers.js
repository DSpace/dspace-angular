const {
    join,
    resolve,
    normalize,
} = require('path');


function root(path) {
    return resolve(__dirname, '..', path);
}

// const theme = '';
const theme = 'mantis';

const themePath = normalize(join(__dirname, '..', 'themes', theme));

const globalCSSImports = [
    resolve(__dirname, '..', 'src/styles/_variables.scss'),
    resolve(__dirname, '..', 'src/styles/_mixins.scss'),
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

module.exports = {
    root: root,
    join: join,
    theme: theme,
    themePath: themePath,
    globalCSSImports: globalCSSImports,
    themeReplaceOptions: themeReplaceOptions
};
