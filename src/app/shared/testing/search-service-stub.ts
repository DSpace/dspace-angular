import {of as observableOf,  Observable ,  BehaviorSubject } from 'rxjs';
import { SetViewMode } from '../view-mode';

export class SearchServiceStub {

  private _viewMode: SetViewMode;
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testViewMode);

  viewMode = this.subject.asObservable();

  constructor(private searchLink: string = '/search') {
    this.setViewMode(SetViewMode.List);
  }

  getViewMode(): Observable<SetViewMode> {
    return this.viewMode;
  }

  setViewMode(viewMode: SetViewMode) {
    this.testViewMode = viewMode;
  }

  getFacetValuesFor() {
    return null;
  }

  get testViewMode(): SetViewMode {
    return this._viewMode;
  }

  set testViewMode(viewMode: SetViewMode) {
    this._viewMode = viewMode;
    this.subject.next(viewMode);
  }

  getSearchLink() {
    return this.searchLink;
  }

  getFilterLabels() {
    return observableOf([]);
  }

  search() {
    return observableOf({});
  }
}
