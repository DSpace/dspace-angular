import { default as parseSectionErrorPaths } from './parseSectionErrorPaths';
/**
 * the following method accept an array of SubmissionObjectError and return a section errors object
 * @param {errors: SubmissionObjectError[]} errors
 * @returns {any}
 */
var parseSectionErrors = function (errors) {
    if (errors === void 0) { errors = []; }
    var errorsList = Object.create({});
    errors.forEach(function (error) {
        var paths = parseSectionErrorPaths(error.paths);
        paths.forEach(function (path) {
            var sectionError = { path: path.originalPath, message: error.message };
            if (!errorsList[path.sectionId]) {
                errorsList[path.sectionId] = [];
            }
            errorsList[path.sectionId].push(sectionError);
        });
    });
    return errorsList;
};
export default parseSectionErrors;
//# sourceMappingURL=parseSectionErrors.js.map