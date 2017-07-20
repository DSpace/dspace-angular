import { Observable } from 'rxjs/Observable';

export abstract class DataLoader {

  protected language: string;

  protected abstract prefix: string;

  protected abstract suffix: string;

  constructor() {
    this.language = 'en';
  }

  public setLanguage(language: string): void {
    this.language = language;
  }

  abstract getData(name: string): Observable<any>;

}
