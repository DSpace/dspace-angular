import { Observable } from 'rxjs/Observable';

export class MockRouter {
  public events = Observable.of({});
  public routerState = {
    snapshot: {
      url: ''
    }
  };

  // noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  navigateByUrl = jasmine.createSpy('navigateByUrl');

  setRoute(route) {
    this.routerState.snapshot.url = route;
  }
}
