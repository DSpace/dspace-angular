"use strict";
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUnixStylePath = exports.stringLiteral = exports.match = void 0;
function match(rangeA, rangeB) {
    return rangeA[0] === rangeB[0] && rangeA[1] === rangeB[1];
}
exports.match = match;
function stringLiteral(value) {
    return `'${value}'`;
}
exports.stringLiteral = stringLiteral;
/**
 * Transform Windows-style paths into Unix-style paths
 */
function toUnixStylePath(path) {
    // note: we're assuming that none of the directory/file names contain '\' or '/' characters.
    //       using these characters in paths is very bad practice in general, so this should be a safe assumption.
    if (path.includes('\\')) {
        return path.replace(/^[A-Z]:\\/, '/').replaceAll('\\', '/');
    }
    return path;
}
exports.toUnixStylePath = toUnixStylePath;
//# sourceMappingURL=misc.js.map