import { readFileSync } from 'node:fs';

import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { getTranslationFileName } from './translation-file-name';

/**
 * A TranslateLoader for ngx-translate to parse json5 files server-side.
 *
 * The parsed translation messages are intentionally NOT stored in the TransferState, as that would embed the
 * complete i18n message catalog in every server-side rendered page. Instead, a preload link for the
 * (cacheable) translation file is added to the document head, so the browser can start downloading
 * the file right away while the client app is bootstrapping.
 */
export class TranslateServerLoader implements TranslateLoader {

  constructor(
    protected document: Document,
    protected prefix: string = 'dist/assets/i18n/',
    protected suffix: string = '.json',
    protected browserPrefix: string = 'assets/i18n/',
  ) {
  }

  /**
   * Return the i18n messages for a given language and add a preload link for them to the document
   *
   * @param lang the language code
   */
  public getTranslation(lang: string): Observable<any> {
    const translationHash: string = (process.env.languageHashes as any)[lang + '.json5'];
    // Retrieve the file for the given language, and parse it
    const messages = JSON.parse(readFileSync(`${this.prefix}${lang}.${translationHash}${this.suffix}`, 'utf8'));
    this.addPreloadLink(`${this.browserPrefix}${getTranslationFileName(lang, this.suffix)}`);
    // Return the parsed messages to translate things server side
    return of(messages);
  }

  /**
   * Add a preload link for the translation file, so the download starts as soon as the browser parses the document head
   *
   * The link is inserted directly after the base element (if any), so the relative href is resolved
   * against the base href.
   *
   * @param href the (relative) URL of the translation file
   * @protected
   */
  protected addPreloadLink(href: string) {
    const head = this.document?.head;
    if (!head) {
      console.warn(`No document head available, the preload link for ${href} is not added`);
      return;
    }
    if (head.querySelector(`link[rel="preload"][href="${href}"]`)) {
      // ignore silently if the link is already present
      return;
    }
    const link = this.document.createElement('link');
    // download translation file with high priority while the page is parsed, and keep it for the later request
    link.setAttribute('rel', 'preload');
    // translation file is requested via HttpClient (XHR): "fetch" ensures preloaded response is reused for that request
    link.setAttribute('as', 'fetch');
    // required for "fetch" preloads, so the preloaded response matches the HttpClient request
    link.setAttribute('crossorigin', 'anonymous');
    link.setAttribute('href', href);
    const base = head.querySelector('base');
    head.insertBefore(link, base ? base.nextSibling : head.firstChild);
  }
}
