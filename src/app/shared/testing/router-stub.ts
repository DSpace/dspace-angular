
export class RouterStub {
  url: string;
  routeReuseStrategy = {shouldReuseRoute: {}};
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  parseUrl = jasmine.createSpy('parseUrl');
  navigateByUrl(url): void {
    this.url = url;
  }
}
