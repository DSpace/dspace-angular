import { hasValue } from '../../shared/empty.util';
var regex = /([^\/]+)/g;
// const regex = /\/sections\/(.*)\/(.*)\/(.*)/;
var regexShort = /\/sections\/(.*)/;
/**
 * The following method accept an array of section path strings and return a path object
 * @param {string | string[]} path
 * @returns {SectionErrorPath[]}
 */
var parseSectionErrorPaths = function (path) {
    var paths = typeof path === 'string' ? [path] : path;
    return paths.map(function (item) {
        if (item.match(regex) && item.match(regex).length > 2) {
            return {
                sectionId: item.match(regex)[1],
                fieldId: item.match(regex)[2],
                fieldIndex: hasValue(item.match(regex)[3]) ? +item.match(regex)[3] : 0,
                originalPath: item,
            };
        }
        else {
            return {
                sectionId: item.match(regexShort)[1],
                originalPath: item,
            };
        }
    });
};
export default parseSectionErrorPaths;
//# sourceMappingURL=parseSectionErrorPaths.js.map