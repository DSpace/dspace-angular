import { Config } from './config';

/**
 * An interface to represent a language in the configuration. A LangConfig has a code which should be the official
 * language code for the language (e.g. ‘fr’), a label which should be the name of the language in that language
 * (e.g. ‘Français’), and a boolean to determine whether or not it should be listed in the language select.
 */
export class LangConfig extends Config {
  @Config.publish() code: string;
  @Config.publish() label: string;
  @Config.publish() active: boolean;
}
