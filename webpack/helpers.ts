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
 * Calculate the hashes of the i18n override files of each theme, e.g. { custom: { 'en.json5': '<hash>' } }
 *
 * @param themesPath The path of the folder containing the themes
 */
export function getThemeLanguageHashes(themesPath: string): { [themeName: string]: { [fileName: string]: string } } {
  const themeHashes: { [themeName: string]: { [fileName: string]: string } } = {};

  if (!existsSync(themesPath)) {
    return themeHashes;
  }

  for (const theme of readdirSync(themesPath)) {
    const i18nPath: string = join(themesPath, theme, 'assets', 'i18n');

    if (!existsSync(i18nPath) || !statSync(i18nPath).isDirectory()) {
      continue;
    }

    const hashes = getFileHashes(i18nPath, /.*\.json5/g);

    if (Object.keys(hashes).length > 0) {
      themeHashes[theme] = hashes;
    }
  }

  return themeHashes;
}
