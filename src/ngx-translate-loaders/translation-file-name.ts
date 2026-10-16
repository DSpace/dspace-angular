import { environment } from '../environments/environment';

/**
 * Returns name of the i18n translation file under which the browser can retrieve translation messages for the given
 * language.
 * In production mode the i18n translation file name contains the content hash of the translation file, so it can be
 * easily cached.
 *
 * @param lang the language code
 * @param suffix the file extension
 */
export function getTranslationFileName(lang: string, suffix: string): string {
  const i18nFileHash: string = environment.production ? `.${(process.env.languageHashes as any)[lang + '.json5']}` : '';
  return `${lang}${i18nFileHash}${suffix}`;
}
