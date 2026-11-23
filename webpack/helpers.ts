import { createHash } from 'node:crypto';
import {
  existsSync,
  readdirSync,
  readFileSync,
  Stats,
  statSync,
} from 'node:fs';
import {
  join,
  resolve,
} from 'node:path';

export const projectRoot = (relativePath) => {
  return resolve(__dirname, '..', relativePath);
};

export const globalCSSImports = () => {
  return [
    projectRoot(join('src', 'styles', '_variables.scss')),
    projectRoot(join('src', 'styles', '_mixins.scss')),
  ];
};

/**
 * Calculates the md5 hash of a file
 *
 * @param filePath The path of the file
 */
export function calculateFileHash(filePath: string): string {
  const fileContent: Buffer = readFileSync(filePath);
  return createHash('md5').update(fileContent).digest('hex');
}

/**
 * Calculate the hashes of all the files (matching the given regex) in a certain folder
 *
 * @param folderPath The path of the folder
 * @param regExp A regex of the files in the folder for which a hash needs to be generated
 */
export function getFileHashes(folderPath: string, regExp: RegExp): { [fileName: string]: string } {
  const files: string[] = readdirSync(folderPath);
  const hashes: { [fileName: string]: string } = {};

  for (const file of files) {
    if (file.match(regExp)) {
      const filePath: string = join(folderPath, file);
      const stats: Stats = statSync(filePath);

      if (stats.isFile()) {
        hashes[file] = calculateFileHash(filePath);
      }
    }
  }

  return hashes;
}

/**
 * Collect the languages each theme provides an i18n override file for, e.g. { custom: ['en'] }
 *
 * @param themesPath The path of the folder containing the themes
 */
export function getThemeLanguages(themesPath: string): { [themeName: string]: string[] } {
  const extension = '.json5';
  const themeLanguages: { [themeName: string]: string[] } = {};

  if (!existsSync(themesPath)) {
    return themeLanguages;
  }

  for (const theme of readdirSync(themesPath)) {
    const i18nPath: string = join(themesPath, theme, 'assets', 'i18n');

    if (!existsSync(i18nPath) || !statSync(i18nPath).isDirectory()) {
      continue;
    }

    const languages: string[] = readdirSync(i18nPath)
      .filter((file: string) => file.endsWith(extension) && statSync(join(i18nPath, file)).isFile())
      .map((file: string) => file.slice(0, -extension.length));

    if (languages.length > 0) {
      themeLanguages[theme] = languages;
    }
  }

  return themeLanguages;
}
