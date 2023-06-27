import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

export class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return observableOf({});
  }
}
