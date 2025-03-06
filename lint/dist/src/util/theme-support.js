"use strict";
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixSelectors = exports.DISALLOWED_THEME_SELECTORS = exports.isAllowedUnthemedUsage = exports.getThemeableComponentByBaseClass = exports.allThemeableComponents = exports.inThemedComponentOverrideFile = exports.isThemeableComponent = exports.getBaseComponentClassName = exports.isThemedComponentWrapper = exports.themeableComponents = void 0;
const utils_1 = require("@typescript-eslint/utils");
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const angular_1 = require("./angular");
const typescript_2 = require("./typescript");
function isAngularComponentDecorator(node) {
    if (node.kind === typescript_1.default.SyntaxKind.Decorator && node.parent.kind === typescript_1.default.SyntaxKind.ClassDeclaration) {
        const decorator = node;
        if (decorator.expression.kind === typescript_1.default.SyntaxKind.CallExpression) {
            const method = decorator.expression;
            if (method.expression.kind === typescript_1.default.SyntaxKind.Identifier) {
                return method.expression.text === 'Component';
            }
        }
    }
    return false;
}
function findImportDeclaration(source, identifierName) {
    return typescript_1.default.forEachChild(source, (topNode) => {
        if (topNode.kind === typescript_1.default.SyntaxKind.ImportDeclaration) {
            const importDeclaration = topNode;
            if (importDeclaration.importClause?.namedBindings?.kind === typescript_1.default.SyntaxKind.NamedImports) {
                const namedImports = importDeclaration.importClause?.namedBindings;
                for (const element of namedImports.elements) {
                    if (element.name.text === identifierName) {
                        return importDeclaration;
                    }
                }
            }
        }
        return undefined;
    });
}
/**
 * Listing of all themeable Components
 */
class ThemeableComponentRegistry {
    constructor() {
        this.entries = new Set();
        this.byBaseClass = new Map();
        this.byWrapperClass = new Map();
        this.byBasePath = new Map();
        this.byWrapperPath = new Map();
    }
    initialize(prefix = '') {
        if (this.entries.size > 0) {
            return;
        }
        function registerWrapper(path) {
            const source = getSource(path);
            function traverse(node) {
                if (node.parent !== undefined && isAngularComponentDecorator(node)) {
                    const classNode = node.parent;
                    if (classNode.name === undefined || classNode.heritageClauses === undefined) {
                        return;
                    }
                    const wrapperClass = classNode.name?.escapedText;
                    for (const heritageClause of classNode.heritageClauses) {
                        for (const type of heritageClause.types) {
                            if (type.expression.escapedText === 'ThemedComponent') {
                                if (type.kind !== typescript_1.default.SyntaxKind.ExpressionWithTypeArguments || type.typeArguments === undefined) {
                                    continue;
                                }
                                const firstTypeArg = type.typeArguments[0];
                                const baseClass = firstTypeArg.typeName?.escapedText;
                                if (baseClass === undefined) {
                                    continue;
                                }
                                const importDeclaration = findImportDeclaration(source, baseClass);
                                if (importDeclaration === undefined) {
                                    continue;
                                }
                                const basePath = resolveLocalPath(importDeclaration.moduleSpecifier.text, path);
                                exports.themeableComponents.add({
                                    baseClass,
                                    basePath: basePath.replace(new RegExp(`^${prefix}`), ''),
                                    baseFileName: (0, path_1.basename)(basePath).replace(/\.ts$/, ''),
                                    wrapperClass,
                                    wrapperPath: path.replace(new RegExp(`^${prefix}`), ''),
                                    wrapperFileName: (0, path_1.basename)(path).replace(/\.ts$/, ''),
                                });
                            }
                        }
                    }
                    return;
                }
                else {
                    typescript_1.default.forEachChild(node, traverse);
                }
            }
            traverse(source);
        }
        const glob = require('glob');
        // note: this outputs Unix-style paths on Windows
        const wrappers = glob.GlobSync(prefix + 'src/app/**/themed-*.component.ts', { ignore: 'node_modules/**' }).found;
        for (const wrapper of wrappers) {
            registerWrapper(wrapper);
        }
    }
    add(entry) {
        this.entries.add(entry);
        this.byBaseClass.set(entry.baseClass, entry);
        this.byWrapperClass.set(entry.wrapperClass, entry);
        this.byBasePath.set(entry.basePath, entry);
        this.byWrapperPath.set(entry.wrapperPath, entry);
    }
}
exports.themeableComponents = new ThemeableComponentRegistry();
/**
 * Construct the AST of a TypeScript source file
 * @param file
 */
function getSource(file) {
    return typescript_1.default.createSourceFile(file, (0, fs_1.readFileSync)(file).toString(), typescript_1.default.ScriptTarget.ES2020, // todo: actually use tsconfig.json?
    /*setParentNodes */ true);
}
/**
 * Resolve a possibly relative local path into an absolute path starting from the root directory of the project
 */
function resolveLocalPath(path, relativeTo) {
    if (path.startsWith('src/')) {
        return path;
    }
    else if (path.startsWith('./')) {
        const parts = relativeTo.split('/');
        return [
            ...parts.slice(0, parts.length - 1),
            path.replace(/^.\//, ''),
        ].join('/') + '.ts';
    }
    else {
        throw new Error(`Unsupported local path: ${path}`);
    }
}
function isThemedComponentWrapper(decoratorNode) {
    if (decoratorNode.parent.type !== utils_1.TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return false;
    }
    if (decoratorNode.parent.superClass?.type !== utils_1.TSESTree.AST_NODE_TYPES.Identifier) {
        return false;
    }
    return decoratorNode.parent.superClass?.name === 'ThemedComponent';
}
exports.isThemedComponentWrapper = isThemedComponentWrapper;
function getBaseComponentClassName(decoratorNode) {
    const wrapperClass = (0, angular_1.getComponentClassName)(decoratorNode);
    if (wrapperClass === undefined) {
        return;
    }
    exports.themeableComponents.initialize();
    const entry = exports.themeableComponents.byWrapperClass.get(wrapperClass);
    if (entry === undefined) {
        return undefined;
    }
    return entry.baseClass;
}
exports.getBaseComponentClassName = getBaseComponentClassName;
function isThemeableComponent(className) {
    exports.themeableComponents.initialize();
    return exports.themeableComponents.byBaseClass.has(className);
}
exports.isThemeableComponent = isThemeableComponent;
function inThemedComponentOverrideFile(filename) {
    const match = filename.match(/src\/themes\/[^\/]+\/(app\/.*)/);
    if (!match) {
        return false;
    }
    exports.themeableComponents.initialize();
    // todo: this is fragile!
    return exports.themeableComponents.byBasePath.has(`src/${match[1]}`);
}
exports.inThemedComponentOverrideFile = inThemedComponentOverrideFile;
function allThemeableComponents() {
    exports.themeableComponents.initialize();
    return [...exports.themeableComponents.entries];
}
exports.allThemeableComponents = allThemeableComponents;
function getThemeableComponentByBaseClass(baseClass) {
    exports.themeableComponents.initialize();
    return exports.themeableComponents.byBaseClass.get(baseClass);
}
exports.getThemeableComponentByBaseClass = getThemeableComponentByBaseClass;
function isAllowedUnthemedUsage(usageNode) {
    return (0, typescript_2.isPartOfClassDeclaration)(usageNode) || (0, typescript_2.isPartOfTypeExpression)(usageNode) || (0, angular_1.isPartOfViewChild)(usageNode);
}
exports.isAllowedUnthemedUsage = isAllowedUnthemedUsage;
exports.DISALLOWED_THEME_SELECTORS = 'ds-(base|themed)-';
function fixSelectors(text) {
    return text.replaceAll(/ds-(base|themed)-/g, 'ds-');
}
exports.fixSelectors = fixSelectors;
//# sourceMappingURL=theme-support.js.map