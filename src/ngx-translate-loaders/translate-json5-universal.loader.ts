import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as JSON5 from 'json5'
import * as fs from 'fs';

export class TranslateJson5UniversalLoader implements TranslateLoader {

  constructor(private prefix: string = 'dist/assets/i18n/', private suffix: string = '.json') { }

  public getTranslation(lang: string): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next(JSON5.parse(fs.readFileSync(`${this.prefix}${lang}${this.suffix}`, 'utf8')));
      observer.complete();
    });
  }

}
