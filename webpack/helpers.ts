import { readFileSync, readdirSync, statSync, Stats } from 'fs';
import { join, resolve } from 'path';

const md5 = require('md5');

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
  return md5(fileContent);
}

/**
 * Calculate the hashes of all the files (matching the given regex) in a certain folder
 *
 * @param folderPath The path of the folder
 * @param regExp A regex of the files in the folder for which a hash needs to be generated
 */
export function getFileHashes(folderPath: string, regExp: RegExp): { [fileName: string]: string } {
  const files: string[] = readdirSync(folderPath);
  let hashes: { [fileName: string]: string } = {};

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
