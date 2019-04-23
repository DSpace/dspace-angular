const {
    join,
    resolve,
} = require('path');


function root(path) {
    return resolve(__dirname, '..', path);
}

const theme = '';
// const theme = 'mantis';

const globalCSSImports = [
    resolve(__dirname, '..', 'src/styles/_variables.scss'),
    resolve(__dirname, '..', 'src/styles/_mixins.scss'),
];

const themeReplaceOptions =
        {
            multiple: [
                {
                    search: '$theme$.',
                    replace: theme + (theme.length ? '.' : ''),

                },
                {
                    search: '$themePath$/',
                    replace: (theme.length ? 'themes/' : ''),

                },
                {
                    search: '$theme$.',
                    replace: (theme.length ? theme + '.' : ''),

                },
                {
                    search: '$themePath$/',
                    replace: (theme.length ? 'themes/' : ''),
                }
            ]
        };

module.exports = {
    root: root,
    join: join,
    theme: theme,
    globalCSSImports: globalCSSImports,
    themeReplaceOptions: themeReplaceOptions
};
