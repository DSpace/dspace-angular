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
  StringLiteral,
  SyntaxKind,
} from 'typescript';

import { DECORATORS } from '../src/app/decorators';
import { DecoratorConfig } from './config/decorator-config.interface';

const COMPONENTS_DIR = resolve(__dirname, '../src');
const REGISTRY_OUTPUT_DIR = resolve(__dirname, '../src/decorator-registries');

/**
 * Scans the code base for enums and extracts their values.
 *
 * @returns A nested map of the enums and their values.
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

const enumValues = generateEnumValues();

const getDecoratorConstName = (decorator: string): string => {
  return decorator
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '');
};

const getDecoratorFileName = (decorator: string): string => {
  return decorator
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .concat('-registry.ts');
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
  decoratorConfig: DecoratorConfig,
  components: Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>,
): void => {
  const mapName = getDecoratorConstName(decoratorConfig.name) + '_MAP';
  const functionName = `${decoratorConfig.name}CreateMap`;
  const mapVarName = `${decoratorConfig.name}Map`;
  let content = '';

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
    content += `${ Array.from(imports.keys()).sort().map((path: string) => `import { ${Array.from(imports.get(path)).join(', ')} } from '${path}';`).join('\n')}\n\n`;
  }

  content += `function ${functionName}(): Map<any, any> {\n`;
  content += `  const ${mapVarName} = new Map();\n\n`;

  const mapPathsSoFar = new Set<string>();

  for (const component of components) {
    const argsArray = decoratorConfig.params.map((param, index) => (index < component.args.length && component.args[index] !== undefined) ? component.args[index] : param.default);

    let currentMapPath = mapVarName;
    let currentPathKey = '';

    for (let i = 0; i < argsArray.length - 1; i++) {
      const key = argsArray[i];
      let keyString: string;
      if (typeof key === 'string' && key.includes('${')) {
        keyString = `\`${key}\``;
      } else if (typeof key === 'string') {
        keyString = `'${key.replace(/'/g, '\\\'')}'`;
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

      const newPath = currentPathKey + '|' + (typeof key === 'object' && 'classRef' in key ? (key.classRef ? key.classRef : key) : String(key));

      if (!mapPathsSoFar.has(newPath)) {
        content += `  ${currentMapPath}.set(${keyString}, new Map());\n`;
        mapPathsSoFar.add(newPath);
      }
      currentMapPath += `.get(${keyString})`;
      currentPathKey = newPath;
    }

    const finalKey = argsArray[argsArray.length - 1];
    let finalKeyString: string;
    if (typeof finalKey === 'string' && finalKey.includes('${')) {
      finalKeyString = `\`${finalKey}\``;
    } else if (typeof finalKey === 'string') {
      finalKeyString = `'${finalKey.replace(/'/g, '\\\'')}'`;
    } else if (finalKey && typeof finalKey === 'object' && 'classRef' in finalKey) {
      const param = decoratorConfig.params[argsArray.length - 1];
      if (param.property) {
        finalKeyString = `${finalKey.classRef}.${param.property}`;
      } else {
        finalKeyString = finalKey.classRef;
      }
    } else {
      finalKeyString = String(finalKey);
    }

    const lazyImport = `() => import('${component.filePath}').then(c => c.${component.name})`;
    content += `  ${currentMapPath}.set(${finalKeyString}, ${lazyImport});\n`;
  }

  content += `\n  return ${mapVarName};\n`;
  content += `}\n\n`;
  content += `export const ${mapName} = ${functionName}();\n`;


  const filePath = join(REGISTRY_OUTPUT_DIR, getDecoratorFileName(decoratorConfig.name));
  if (!existsSync(filePath) || readFileSync(filePath, 'utf8') !== content) {
    writeFileSync(filePath, content, 'utf8');
  }
};

const generateRegistries = (
  decoratorConfigs: DecoratorConfig[],
): Map<string, Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>> => {
  // Initialize the map using decorator names as keys, and empty lists as values
  const decoratorMap = new Map<string, Array<{ name: string, filePath: string, args: any[], imports: Map<string, string> }>>();
  decoratorConfigs.forEach(config => {
    decoratorMap.set(config.name, []);
  });

  // Get all TypeScript files recursively, excluding spec files
  const fileNames = sync(`${COMPONENTS_DIR}/**/*.ts`, { ignore: `${COMPONENTS_DIR}/**/*.spec.ts` });

  fileNames.forEach((filePath: string) => {
    const fileName = basename(filePath);
    const sourceFile = createSourceFile(fileName, readFileSync(filePath, 'utf8'), ScriptTarget.Latest);

    // The key of the map is the import name, and the value is the path
    const imports: Map<string, string> = new Map();
    forEachChild(sourceFile, (node: ImportDeclaration) => {
      if (node.kind === SyntaxKind.ImportDeclaration && node.importClause?.namedBindings?.kind === SyntaxKind.NamedImports) {
        node.importClause.namedBindings.elements.forEach(element => {
          imports.set(element.name.text, (node.moduleSpecifier as StringLiteral).text);
        });
      }
    });

    // Walk the AST to find class declarations with decorators
    forEachChild(sourceFile, node => {
      if (isClassDeclaration(node) && node.name) {
        const decorators = getDecorators(node);
        const componentName = node.name.text;

        decorators?.forEach((decorator) => {
          if (isCallExpression(decorator.expression)) {
            const currentDecoratorName = (decorator.expression.expression as Identifier).text;

            const decoratorConfig = decoratorConfigs.find(config => config.name === currentDecoratorName);
            if (decoratorConfig) {
              const args: any[] = [];
              const argImports: Map<string, string> = new Map();
              decorator.expression.arguments.forEach((arg) => {
                // e.g. @decorator('range')
                if (isStringLiteral(arg)) {
                  args.push(arg.text);
                  // e.g. @decorator(ItemSearchResult)
                } else if (isIdentifier(arg)) {
                  args.push({ classRef: arg.text });

                  if (imports.has(arg.text)) {
                    let absoluteImportPath = imports.get(arg.text);
                    if (!absoluteImportPath.includes('src/app')) {
                      absoluteImportPath = resolve(dirname(filePath), imports.get(arg.text));
                    }
                    const newRelativePath = relative(REGISTRY_OUTPUT_DIR, absoluteImportPath);
                    argImports.set(arg.text, newRelativePath);
                  }
                  // e.g. @decorator(Enum.property)
                } else if (isPropertyAccessExpression(arg)) {
                  const propertyName = arg.name.text;
                  const objectName = (arg.expression as Identifier).text;
                  const enumValue = enumValues[objectName]?.[propertyName];
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

              // Add to the map under the current decorator's name
              decoratorMap.get(currentDecoratorName)?.push({
                name: componentName,
                filePath: `../${relative(COMPONENTS_DIR, filePath).replace(/\.ts$/, '')}`,
                args,
                imports: argImports,
              });
            }
          }
        });
      }
    });
  });

  return decoratorMap;
};

const main = (): void => {
  mkdirSync(REGISTRY_OUTPUT_DIR, { recursive: true });
  const registriesToDelete: Set<string> = new Set(readdirSync(REGISTRY_OUTPUT_DIR));

  // Generate map with decorator names as keys, lists of component metadata objects as values
  // 1 component metadata object contains: the name of the component, the full path of
  // the component file, and the arguments used in the decorator on that component
  const decoratorMap = generateRegistries(DECORATORS);

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
