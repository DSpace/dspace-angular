import { of as observableOf } from 'rxjs';
export class RouterStub {
  url: string;
  routeReuseStrategy = {shouldReuseRoute: {}};
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  parseUrl = jasmine.createSpy('parseUrl');
  events = observableOf({});
  navigateByUrl(url): void {
    this.url = url;
  }
}
