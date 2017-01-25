import { TranslateLoader } from "ng2-translate";
import { Observable } from "rxjs";

export class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of({});
  }
}
