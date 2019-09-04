import {Observable, of as observableOf} from 'rxjs';
export class RouterEventsStub {
  url: string;
  routeReuseStrategy = {shouldReuseRoute: {}};
  //noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  parseUrl = jasmine.createSpy('parseUrl');
  events = new Observable((observer) => {
    this.eventArr.forEach((e) => {
      observer.next(e);
    });
    observer.complete();
  });
  eventArr: any;

  // Stub constructor takes array of event objects.
  constructor( events: any = observableOf({})) {
    this.eventArr = events;
  }

  navigateByUrl(url): void {
    this.url = url;
  }
}
