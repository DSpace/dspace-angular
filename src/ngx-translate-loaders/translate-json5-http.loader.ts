import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import JSON5 from 'json5';

export class TranslateJson5HttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, public prefix?: string, public suffix?: string) {
  }

  getTranslation(lang: string): any {
    return this.http.get('' + this.prefix + lang + this.suffix, {responseType: 'text'}).pipe(
      map((json: any) => JSON5.parse(json))
    );
  }
}
