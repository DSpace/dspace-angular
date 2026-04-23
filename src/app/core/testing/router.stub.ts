import { of } from 'rxjs';

export class RouterStub {
  url: string;
  routeReuseStrategy = { shouldReuseRoute: {} };
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
  parseUrl = jasmine.createSpy('parseUrl');
  events = of({});
  navigateByUrl(url): void {
    this.url = url;
  }
  createUrlTree(commands, navigationExtras = {}) {
    return '/testing-url';
  }
  serializeUrl(commands, navExtras = {}) {
    return '/testing-url';
  }
}
