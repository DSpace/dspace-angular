import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

export class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({});
  }
}
