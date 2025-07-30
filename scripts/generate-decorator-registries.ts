import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { sync } from 'glob';
import {
  basename,
  dirname,
  join,
  relative,
  resolve,
} from 'path';
import {
  createSourceFile,
  forEachChild,
  getDecorators,
  Identifier,
  ImportDeclaration,
  isCallExpression,
  isClassDeclaration,
  isEnumDeclaration,
  isExpressionWithTypeArguments,
  isIdentifier,
  isPropertyAccessExpression,
  isStringLiteral,
  ScriptTarget,
  SourceFile,
  StringLiteral,
  SyntaxKind,
} from 'typescript';

import { DECORATORS } from '../src/app/decorators';
import { DecoratorConfig } from './config/decorator-config.interface';

const COMPONENTS_DIR = resolve(__dirname, '../src');
const REGISTRY_OUTPUT_DIR = resolve(__dirname, '../src/decorator-registries');

/**
 * Scans the code base for enums and extracts their values, e.g. { FeatureID: { AdministratorOf: 'administratorOf' } }.
 */
const generateEnumValues = () => {
  const enumValues = {};

  const fileNames = sync(`${COMPONENTS_DIR}/**/*.ts`, { ignore: `${COMPONENTS_DIR}/**/*.spec.ts` });

  fileNames.forEach((filePath: string) => {
    const fileName = basename(filePath);
    const sourceFile = createSourceFile(fileName, readFileSync(filePath, 'utf8'), ScriptTarget.Latest);

    if (!sourceFile.isDeclarationFile) {
      forEachChild(sourceFile, node => {
        if (isEnumDeclaration(node)) {
          const enumName = node.name.text;
          enumValues[enumName] = {};

          for (const value of node.members) {
            const valueName = value.name.getText(sourceFile);
            if (value.initializer && isStringLiteral(value.initializer)) {
              enumValues[enumName][valueName] = value.initializer.text;
            }
          }
        }
      });
    }
  });

  return enumValues;
};

const ENUM_VALUES = generateEnumValues();

/**
 * For example, 'listableObjectComponent' becomes 'LISTABLE_OBJECT_COMPONENT'.
 */
export const getDecoratorConstName = (decorator: string): string => {
  return decorator
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '');
};

/**
 * For example, 'listableObjectComponent' becomes 'listable-object-component-registry.ts'.
 */
export const getDecoratorFileName = (decorator: string): string => {
  return decorator
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .concat('-registry.ts');
};

/**
 * Parse map key depending on its object type.
 * If a value had a {@link DecoratorParam#property}, use that instead of just the value.
 */
const parseKey = (
  key: any, decoratorConfig: DecoratorConfig, argsArray: any[],
): string => {
  let keyString: string;
  if (typeof key === 'string' && key.includes('${')) {
    keyString = `\`${key.replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\``;
  } else if (typeof key === 'string') {
    keyString = `'${key.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  } else if (key && typeof key === 'object' && 'classRef' in key) {
    const param = decoratorConfig.params[argsArray.length - 1];
    if (param.property) {
      keyString = `${key.classRef}.${param.property}`;
    } else {
      keyString = key.classRef;
    }
  } else {
    keyString = String(key);
  }
  return keyString;
};

/**
 * Consolidate the imports and generate import statements strings.
 *
 * While the imports in the component metadata are stored as { object: path }, this method flips that.
 * So objects originating from the same path, can be stored together under that same path key.
 */
const generateImportStatements = (
  components: Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>,
): string => {
  let result = '';
  const imports: Map<string, Set<string>> = new Map();
  components.forEach(component => {
    for (const componentImport of component.imports.keys()) {
      const importPath: string = component.imports.get(componentImport);
      if (!imports.get(importPath)) {
        imports.set(importPath, new Set());
      }
      imports.get(importPath).add(componentImport);
    }
  });

  if (imports.size > 0) {
    result += `${ Array.from(imports.keys()).sort().map((path: string) => `import { ${Array.from(imports.get(path)).join(', ')} } from '${path}';`).join('\n')}\n\n`;
  }
  return result;
};

/**
 * Generate Map#set statements to create a nested map.
 */
const generateMapCreationStatements = (
  components: Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>, decoratorConfig: DecoratorConfig, mapVarName: string,
) => {
  let result = '';
  // Use mapPathsSoFar to track for which levels a sub-map already exists.
  const mapPathsSoFar = new Set<string>();

  for (const component of components) {
    // Substitute every missing argument with the parameter default.
    const argsArray = decoratorConfig.params.map((param, index) =>
      (index < component.args.length && component.args[index]?.classRef !== 'undefined')
        ? component.args[index]
        : param.default);

    let currentMapPath = mapVarName;
    let currentPathKey = '';
    // Do not process the final decorator argument yet. That is used as key for the lazy import (the lowest level of the map).
    for (let i = 0; i < argsArray.length - 1; i++) {
      const key = argsArray[i];
      const keyString = parseKey(key, decoratorConfig, argsArray);
      const newPath = currentPathKey + '|' + (typeof key === 'object' && 'classRef' in key ? (key.classRef ? key.classRef : key) : String(key));
      if (!mapPathsSoFar.has(newPath)) {
        result += `  ${currentMapPath}.set(${keyString}, new Map());\n`;
        mapPathsSoFar.add(newPath);
      }
      currentMapPath += `.get(${keyString})`;
      currentPathKey = newPath;
    }

    // Handle the lowest level of the map by generating a lazy import to the component.
    const finalKey = argsArray[argsArray.length - 1];
    const finalKeyString = parseKey(finalKey, decoratorConfig, argsArray);
    const lazyImport = `() => import('${component.filePath}').then(c => c.${component.name})`;
    result += `  ${currentMapPath}.set(${finalKeyString}, ${lazyImport});\n`;
  }

  return result;
};

/**
 * Generates and writes a registry TypeScript file for decorator components.
 *
 * @param decoratorConfig - Decorator configuration that's currently being processed.
 * @param {Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>} components - An array of objects, each representing a component.
 *
 * @returns {void} This function does not return a value. It writes a file to the output directory.
 */
const writeRegistryFile = (
  decoratorConfig: DecoratorConfig, components: Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>,
): void => {
  const mapName = getDecoratorConstName(decoratorConfig.name) + '_MAP';
  const functionName = `${decoratorConfig.name}CreateMap`;
  const mapVarName = `${decoratorConfig.name}Map`;
  let content = '';

  // Start the registry file with the import statements, if any.
  content = generateImportStatements(components);

  // Open the map creation function and initialize the decorator map within the function.
  content += `function ${functionName}(): Map<any, any> {\n`;
  content += `  const ${mapVarName} = new Map();\n\n`;

  // Add the nested map statements.
  content += generateMapCreationStatements(components, decoratorConfig, mapVarName);

  // Close off the map creation function and export the map as a constant.
  content += `\n  return ${mapVarName};\n`;
  content += `}\n\n`;
  content += `export const ${mapName} = ${functionName}();\n`;


  // Actually write to the file.
  const filePath = join(REGISTRY_OUTPUT_DIR, getDecoratorFileName(decoratorConfig.name));
  if (!existsSync(filePath) || readFileSync(filePath, 'utf8') !== content) {
    writeFileSync(filePath, content, 'utf8');
  }
};

/**
 * Generate a map of the import statements in the provided file.
 * Keys are the imported objects, values are the paths to those objects.
 */
const generateImportsMap = (file: SourceFile): Map<string, string> => {
  const imports: Map<string, string> = new Map();
  forEachChild(file, (node: ImportDeclaration) => {
    if (node.kind === SyntaxKind.ImportDeclaration && node.importClause?.namedBindings?.kind === SyntaxKind.NamedImports) {
      node.importClause.namedBindings.elements.forEach(element => {
        imports.set(element.name.text, (node.moduleSpecifier as StringLiteral).text);
      });
    }
  });
  return imports;
};

/**
 * First, retrieve the import of a decorator parameter from all the imports in its component file.
 * If necessary, convert that import from a relative to an absolute path.
 * Then resolve that to a relative path, relative to the decorator registries directory.
 */
const parseImportPath = (allImports: Map<string, string>, arg: any, filePath: string): string => {
  let absoluteImportPath = allImports.get(arg.text);
  if (!absoluteImportPath.includes('src/app')) {
    absoluteImportPath = resolve(dirname(filePath), allImports.get(arg.text));
  }
  return relative(REGISTRY_OUTPUT_DIR, absoluteImportPath);
};

/**
 * Parses the decorator arguments on a specific component, along with a map of imports.
 * The map has the imported argument objects as keys, the import paths as values.
 */
const parseDecoratorArguments = (
  decorator: any, allImports: Map<string, string>, filePath: string, sourceFile: SourceFile,
) => {
  const args: any[] = [];
  const argImports: Map<string, string> = new Map();
  decorator.expression.arguments.forEach((arg) => {
    // e.g. @decorator('range')
    if (isStringLiteral(arg)) {
      args.push(arg.text);
    // e.g. @decorator(ItemSearchResult)
    } else if (isIdentifier(arg)) {
      // Store this under classRef so we can extract a property from it later (if so configured).
      args.push({ classRef: arg.text });
      if (allImports.has(arg.text)) {
        argImports.set(arg.text, parseImportPath(allImports, arg, filePath));
      }
    // e.g. @decorator(Enum.property)
    } else if (isPropertyAccessExpression(arg)) {
      const propertyName = arg.name.text;
      const objectName = (arg.expression as Identifier).text;
      const enumValue = ENUM_VALUES[objectName]?.[propertyName];
      args.push(enumValue || `${objectName}.${propertyName}`);
    // e.g. @decorator(PaginatedList<AdminNotifySearchResult>)
    } else if (isExpressionWithTypeArguments(arg)) {
      args.push(arg.typeArguments[0].getText(sourceFile));
    } else if (arg.kind === SyntaxKind.TrueKeyword) {
      args.push(true);
    } else if (arg.kind === SyntaxKind.FalseKeyword) {
      args.push(false);
    }
  });
  return { args: args, imports: argImports };
};

/**
 * Generates a component metadata object which contains:
 * - the name of the component
 * - the full path of the component file
 * - the arguments used in the decorator on that component
 * - an import map, with the imported objects as keys, and the paths to those objects as values
 */
const generateComponentMetadataObject = (
  decorator: any, componentName: string, filePath: string, sourceFile: SourceFile, allImports: Map<string, string>,
): { name: string, filePath: string, args: any[], imports: Map<string, string> } => {
  const parsedArgsAndImports = parseDecoratorArguments(decorator, allImports, filePath, sourceFile);
  const args =  parsedArgsAndImports.args;
  const argImports = parsedArgsAndImports.imports;

  return {
    name: componentName,
    filePath: `../${relative(COMPONENTS_DIR, filePath).replace(/\.ts$/, '')}`,
    args,
    imports: argImports,
  };
};

/**
 *  Walk the AST of a file to find class declarations with decorators.
 */
const walkASTForDecorators = (
  sourceFile: SourceFile, filePath: string, allImports: Map<string, string>, decoratorConfigs: DecoratorConfig[],
): Array<{ decoratorName: string, component: { name: string, filePath: string, args: any[], imports: Map<string, string> } }> => {
  const foundComponents: Array<{ decoratorName: string, component: { name: string, filePath: string, args: any[], imports: Map<string, string> } }> = [];

  forEachChild(sourceFile, node => {
    if (isClassDeclaration(node) && node.name) {
      const decorators = getDecorators(node);
      const componentName = node.name.text;

      decorators?.forEach((decorator) => {
        if (isCallExpression(decorator.expression)) {
          const currentDecoratorName = (decorator.expression.expression as Identifier).text;
          const decoratorConfig = decoratorConfigs.find(config => config.name === currentDecoratorName);

          if (decoratorConfig) {
            const component = generateComponentMetadataObject(decorator, componentName, filePath, sourceFile, allImports);
            foundComponents.push({
              decoratorName: currentDecoratorName,
              component,
            });
          }
        }
      });
    }
  });

  return foundComponents;
};

/**
 * Generate a map with decorator names as keys, lists of component metadata objects as values.
 */
const generateDecoratorMap = (
  decoratorConfigs: DecoratorConfig[],
): Map<string, Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>> => {
  // Initialize the map using decorator names as keys, and empty lists as values.
  const decoratorMap = new Map<string, Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>>();
  decoratorConfigs.forEach(config => {
    decoratorMap.set(config.name, []);
  });

  // Get all TypeScript files recursively, excluding spec files.
  const fileNames = sync(`${COMPONENTS_DIR}/**/*.ts`, { ignore: `${COMPONENTS_DIR}/**/*.spec.ts` });

  fileNames.forEach((filePath: string) => {
    const fileName = basename(filePath);
    const sourceFile = createSourceFile(fileName, readFileSync(filePath, 'utf8'), ScriptTarget.Latest);

    // Get all imports in this file.
    const allImports: Map<string, string> = generateImportsMap(sourceFile);

    // Walk the AST of this file to find decorators and their component metadata.
    const foundComponents = walkASTForDecorators(sourceFile, filePath, allImports, decoratorConfigs);

    // Add the found entries to the general decorator map.
    foundComponents.forEach(({ decoratorName, component }) => {
      decoratorMap.get(decoratorName)?.push(component);
    });
  });

  return decoratorMap;
};

const main = (): void => {
  mkdirSync(REGISTRY_OUTPUT_DIR, { recursive: true });
  const registriesToDelete: Set<string> = new Set(readdirSync(REGISTRY_OUTPUT_DIR));

  const decoratorMap = generateDecoratorMap(DECORATORS);

  // Write registry files for each decorator
  DECORATORS.forEach(decoratorConfig => {
    registriesToDelete.delete(getDecoratorFileName(decoratorConfig.name));
    const componentsForDecorator = decoratorMap.get(decoratorConfig.name);
    if (componentsForDecorator && componentsForDecorator.length > 0) {
      writeRegistryFile(decoratorConfig, componentsForDecorator);
    } else {
      console.warn(`No components found for decorator '${decoratorConfig.name}'`);
    }
  });

  registriesToDelete.forEach((fileName: string) => rmSync(join(REGISTRY_OUTPUT_DIR, fileName)));

  console.debug(`Generated decorator registry files in ${REGISTRY_OUTPUT_DIR}`);
};

main();
