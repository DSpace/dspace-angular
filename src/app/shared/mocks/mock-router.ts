import { Observable, of as observableOf } from 'rxjs';

export class MockRouter {
  public events = observableOf({});
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
