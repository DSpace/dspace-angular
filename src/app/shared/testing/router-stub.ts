
export class RouterStub {
  url: string;
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  parseUrl = jasmine.createSpy('parseUrl');
  navigateByUrl(url): void {
    this.url = url;
  }
}
