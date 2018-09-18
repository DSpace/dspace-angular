import { Observable } from 'rxjs/Observable';

export class RouterStub {
  url: string;
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  parseUrl = jasmine.createSpy('parseUrl');
  events = Observable.of({});
  navigateByUrl(url): void {
    this.url = url;
  }
}
