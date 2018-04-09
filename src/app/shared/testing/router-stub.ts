export class RouterStub {
  url: string;
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  navigateByUrl(url): void {
    this.url = url;
  }
}
