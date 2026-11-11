import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getTranslationFileName } from './translation-file-name';

/**
 * A TranslateLoader for ngx-translate to retrieve i18n messages using HttpClient
 */
export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    protected http: HttpClient,
    protected prefix?: string,
    protected suffix?: string,
  ) {
  }

  /**
   * Return the i18n messages for a given language
   *
   * @param lang the language code
   */
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${getTranslationFileName(lang, this.suffix)}`, { responseType: 'text' }).pipe(
      map((json: any) => JSON.parse(json)),
    );
  }
}
