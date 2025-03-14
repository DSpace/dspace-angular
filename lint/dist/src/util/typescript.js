"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findImportSpecifier = exports.relativePath = exports.isPartOfClassDeclaration = exports.isPartOfTypeExpression = exports.findUsagesByName = exports.findUsages = exports.getObjectPropertyNodeByName = exports.getSourceCode = exports.getFilename = void 0;
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
const utils_1 = require("@typescript-eslint/utils");
const misc_1 = require("./misc");
/**
 * Return the current filename based on the ESLint rule context as a Unix-style path.
 * This is easier for regex and comparisons to glob paths.
 */
function getFilename(context) {
    // TSESLint claims this is deprecated, but the suggested alternative is undefined (could be a version mismatch between ESLint and TSESlint?)
    // eslint-disable-next-line deprecation/deprecation
    return (0, misc_1.toUnixStylePath)(context.getFilename());
}
exports.getFilename = getFilename;
function getSourceCode(context) {
    // TSESLint claims this is deprecated, but the suggested alternative is undefined (could be a version mismatch between ESLint and TSESlint?)
    // eslint-disable-next-line deprecation/deprecation
    return context.getSourceCode();
}
exports.getSourceCode = getSourceCode;
function getObjectPropertyNodeByName(objectNode, propertyName) {
    for (const propertyNode of objectNode.properties) {
        if (propertyNode.type === utils_1.TSESTree.AST_NODE_TYPES.Property
            && ((propertyNode.key?.type === utils_1.TSESTree.AST_NODE_TYPES.Identifier
                && propertyNode.key?.name === propertyName) || (propertyNode.key?.type === utils_1.TSESTree.AST_NODE_TYPES.Literal
                && propertyNode.key?.value === propertyName))) {
            return propertyNode.value;
        }
    }
    return undefined;
}
exports.getObjectPropertyNodeByName = getObjectPropertyNodeByName;
function findUsages(context, localNode) {
    const source = getSourceCode(context);
    const usages = [];
    for (const token of source.ast.tokens) {
        if (token.type === utils_1.TSESTree.AST_TOKEN_TYPES.Identifier && token.value === localNode.name && !(0, misc_1.match)(token.range, localNode.range)) {
            const node = source.getNodeByRangeIndex(token.range[0]);
            // todo: in some cases, the resulting node can actually be the whole program (!)
            if (node !== null) {
                usages.push(node);
            }
        }
    }
    return usages;
}
exports.findUsages = findUsages;
function findUsagesByName(context, identifier) {
    const source = getSourceCode(context);
    const usages = [];
    for (const token of source.ast.tokens) {
        if (token.type === utils_1.TSESTree.AST_TOKEN_TYPES.Identifier && token.value === identifier) {
            const node = source.getNodeByRangeIndex(token.range[0]);
            // todo: in some cases, the resulting node can actually be the whole program (!)
            if (node !== null) {
                usages.push(node);
            }
        }
    }
    return usages;
}
exports.findUsagesByName = findUsagesByName;
function isPartOfTypeExpression(node) {
    return node.parent?.type?.valueOf().startsWith('TSType');
}
exports.isPartOfTypeExpression = isPartOfTypeExpression;
function isPartOfClassDeclaration(node) {
    return node.parent?.type === utils_1.TSESTree.AST_NODE_TYPES.ClassDeclaration;
}
exports.isPartOfClassDeclaration = isPartOfClassDeclaration;
function fromSrc(path) {
    const m = path.match(/^.*(src\/.+)(\.(ts|json|js)?)$/);
    if (m) {
        return m[1];
    }
    else {
        throw new Error(`Can't infer project-absolute TS/resource path from: ${path}`);
    }
}
function relativePath(thisFile, importFile) {
    const fromParts = fromSrc(thisFile).split('/');
    const toParts = fromSrc(importFile).split('/');
    let lastCommon = 0;
    for (let i = 0; i < fromParts.length - 1; i++) {
        if (fromParts[i] === toParts[i]) {
            lastCommon++;
        }
        else {
            break;
        }
    }
    const path = toParts.slice(lastCommon, toParts.length).join('/');
    const backtrack = fromParts.length - lastCommon - 1;
    let prefix;
    if (backtrack > 0) {
        prefix = '../'.repeat(backtrack);
    }
    else {
        prefix = './';
    }
    return prefix + path;
}
exports.relativePath = relativePath;
function findImportSpecifier(context, identifier) {
    const source = getSourceCode(context);
    const usages = [];
    for (const token of source.ast.tokens) {
        if (token.type === utils_1.TSESTree.AST_TOKEN_TYPES.Identifier && token.value === identifier) {
            const node = source.getNodeByRangeIndex(token.range[0]);
            // todo: in some cases, the resulting node can actually be the whole program (!)
            if (node && node.parent && node.parent.type === utils_1.TSESTree.AST_NODE_TYPES.ImportSpecifier) {
                return node.parent;
            }
        }
    }
    return undefined;
}
exports.findImportSpecifier = findImportSpecifier;
//# sourceMappingURL=typescript.js.map