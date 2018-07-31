import { Observable } from 'rxjs/Observable';

export class MockRouter {
  public events = Observable.of({});

  // noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
}
