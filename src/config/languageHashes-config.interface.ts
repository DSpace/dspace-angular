import { Config } from './config.interface';

/**
 * An interface to represent a languageHash in the configuration. A LanguageHashConfig has a lang attribute which should be the official
 * language code for the language (e.g. ‘fr’) and a md5 string representing the checksum of the language asset file.
 */
export interface LanguageHashesConfig extends Config {
      lang: string;
      md5: string;
}
