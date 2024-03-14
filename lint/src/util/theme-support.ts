/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { readFileSync } from 'fs';
import { basename } from 'path';
import ts from 'typescript';
import {
  isClassDeclaration,
  isPartOfTypeExpression,
  isPartOfViewChild,
} from './misc';

const glob = require('glob');

/**
 * Couples a themeable Component to its ThemedComponent wrapper
 */
export interface ThemeableComponentRegistryEntry {
  basePath: string;
  baseFileName: string,
  baseClass: string;

  wrapperPath: string;
  wrapperFileName: string,
  wrapperClass: string;
}

/**
 * Listing of all themeable Components
 */
class ThemeableComponentRegistry {
  public readonly entries: Set<ThemeableComponentRegistryEntry>;
  public readonly byBaseClass: Map<string, ThemeableComponentRegistryEntry>;
  public readonly byBasePath: Map<string, ThemeableComponentRegistryEntry>;
  public readonly byWrapperPath: Map<string, ThemeableComponentRegistryEntry>;

  constructor() {
    this.entries = new Set();
    this.byBaseClass = new Map();
    this.byBasePath = new Map();
    this.byWrapperPath = new Map();
  }

  public initialize(prefix = '') {
    if (this.entries.size > 0) {
      return;
    }

    function registerWrapper(path: string) {
      const source = getSource(path);

      function traverse(node: any) {
        if (node.kind === ts.SyntaxKind.Decorator && node.expression.expression.escapedText === 'Component' && node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
          const wrapperClass = node.parent.name.escapedText;

          for (const heritageClause of node.parent.heritageClauses) {
            for (const type of heritageClause.types) {
              if (type.expression.escapedText === 'ThemedComponent') {
                const baseClass = type.typeArguments[0].typeName?.escapedText;

                ts.forEachChild(source, (topNode: any) => {
                  if (topNode.kind === ts.SyntaxKind.ImportDeclaration) {
                    for (const element of topNode.importClause.namedBindings.elements) {
                      if (element.name.escapedText === baseClass) {
                        const basePath = resolveLocalPath(topNode.moduleSpecifier.text, path);

                        themeableComponents.add({
                          baseClass,
                          basePath: basePath.replace(new RegExp(`^${prefix}`), ''),
                          baseFileName: basename(basePath).replace(/\.ts$/, ''),
                          wrapperClass,
                          wrapperPath: path.replace(new RegExp(`^${prefix}`), ''),
                          wrapperFileName: basename(path).replace(/\.ts$/, ''),
                        });
                      }
                    }
                  }
                });
              }
            }
          }

          return;
        } else {
          ts.forEachChild(node, traverse);
        }
      }

      traverse(source);
    }

    const wrappers: string[] = glob.GlobSync(prefix + 'src/app/**/themed-*.component.ts', { ignore: 'node_modules/**' }).found;

    for (const wrapper of wrappers) {
      registerWrapper(wrapper);
    }
  }

  private add(entry: ThemeableComponentRegistryEntry) {
    this.entries.add(entry);
    this.byBaseClass.set(entry.baseClass, entry);
    this.byBasePath.set(entry.basePath, entry);
    this.byWrapperPath.set(entry.wrapperPath, entry);
  }
}

export const themeableComponents = new ThemeableComponentRegistry();

/**
 * Construct the AST of a TypeScript source file
 * @param file
 */
function getSource(file: string): ts.SourceFile {
  return ts.createSourceFile(
    file,
    readFileSync(file).toString(),
    ts.ScriptTarget.ES2020,  // todo: actually use tsconfig.json?
    /*setParentNodes */ true,
  );
}

/**
 * Resolve a possibly relative local path into an absolute path starting from the root directory of the project
 */
function resolveLocalPath(path: string, relativeTo: string) {
  if (path.startsWith('src/')) {
    return path;
  } else if (path.startsWith('./')) {
    const parts = relativeTo.split('/');
    return [
      ...parts.slice(0, parts.length - 1),
      path.replace(/^.\//, '')
    ].join('/') + '.ts';
  } else {
    throw new Error(`Unsupported local path: ${path}`);
  }
}

export function isThemedComponentWrapper(node: any): boolean {
  return node.parent.superClass?.name === 'ThemedComponent';
}

export function isThemeableComponent(className: string): boolean {
  themeableComponents.initialize();
  return themeableComponents.byBaseClass.has(className);
}

export function inThemedComponentOverrideFile(context: any): boolean {
  const match = context.getFilename().match(/src\/themes\/[^\/]+\/(app\/.*)/);

  if (!match) {
    return false;
  }
  themeableComponents.initialize();
  // todo: this is fragile!
  return themeableComponents.byBasePath.has(`src/${match[1]}`);
}

export function inThemedComponentFile(context: any): boolean {
  themeableComponents.initialize();

  return [
    () => themeableComponents.byBasePath.has(context.getFilename()),
    () => themeableComponents.byWrapperPath.has(context.getFilename()),
    () => inThemedComponentOverrideFile(context),
  ].some(predicate => predicate());
}

export function allThemeableComponents(): ThemeableComponentRegistryEntry[] {
  themeableComponents.initialize();
  return [...themeableComponents.entries];
}

export function getThemeableComponentByBaseClass(baseClass: string): ThemeableComponentRegistryEntry | undefined {
  themeableComponents.initialize();
  return themeableComponents.byBaseClass.get(baseClass);
}

export function isAllowedUnthemedUsage(usageNode: any) {
  return isClassDeclaration(usageNode) || isPartOfTypeExpression(usageNode) || isPartOfViewChild(usageNode);
}

export const DISALLOWED_THEME_SELECTORS = 'ds-(base|themed)-';

export function fixSelectors(text: string): string {
  return text.replaceAll(/ds-(base|themed)-/g, 'ds-');
}
