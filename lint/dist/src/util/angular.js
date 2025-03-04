"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPartOfViewChild = exports.getComponentInitializerNodeByName = exports.getComponentInitializer = exports.getComponentSuperClassName = exports.getComponentClassName = exports.getComponentImportNode = exports.getComponentStandaloneNode = exports.getComponentSelectorNode = void 0;
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
const utils_1 = require("@typescript-eslint/utils");
const typescript_1 = require("./typescript");
function getComponentSelectorNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'selector');
    if (property !== undefined) {
        // todo: support template literals as well
        if (property.type === utils_1.TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'string') {
            return property;
        }
    }
    return undefined;
}
exports.getComponentSelectorNode = getComponentSelectorNode;
function getComponentStandaloneNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'standalone');
    if (property !== undefined) {
        if (property.type === utils_1.TSESTree.AST_NODE_TYPES.Literal && typeof property.value === 'boolean') {
            return property;
        }
    }
    return undefined;
}
exports.getComponentStandaloneNode = getComponentStandaloneNode;
function getComponentImportNode(componentDecoratorNode) {
    const property = getComponentInitializerNodeByName(componentDecoratorNode, 'imports');
    if (property !== undefined) {
        if (property.type === utils_1.TSESTree.AST_NODE_TYPES.ArrayExpression) {
            return property;
        }
    }
    return undefined;
}
exports.getComponentImportNode = getComponentImportNode;
function getComponentClassName(decoratorNode) {
    if (decoratorNode.parent.type !== utils_1.TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return undefined;
    }
    if (decoratorNode.parent.id?.type !== utils_1.TSESTree.AST_NODE_TYPES.Identifier) {
        return undefined;
    }
    return decoratorNode.parent.id.name;
}
exports.getComponentClassName = getComponentClassName;
function getComponentSuperClassName(decoratorNode) {
    if (decoratorNode.parent.type !== utils_1.TSESTree.AST_NODE_TYPES.ClassDeclaration) {
        return undefined;
    }
    if (decoratorNode.parent.superClass?.type !== utils_1.TSESTree.AST_NODE_TYPES.Identifier) {
        return undefined;
    }
    return decoratorNode.parent.superClass.name;
}
exports.getComponentSuperClassName = getComponentSuperClassName;
function getComponentInitializer(componentDecoratorNode) {
    return componentDecoratorNode.expression.arguments[0];
}
exports.getComponentInitializer = getComponentInitializer;
function getComponentInitializerNodeByName(componentDecoratorNode, name) {
    const initializer = getComponentInitializer(componentDecoratorNode);
    return (0, typescript_1.getObjectPropertyNodeByName)(initializer, name);
}
exports.getComponentInitializerNodeByName = getComponentInitializerNodeByName;
function isPartOfViewChild(node) {
    return node.parent?.callee?.name === 'ViewChild';
}
exports.isPartOfViewChild = isPartOfViewChild;
//# sourceMappingURL=angular.js.map