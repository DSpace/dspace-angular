import { Observable } from 'rxjs/Observable';
import { ViewMode } from '../../+search-page/search-options.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class SearchServiceStub {

  private _viewMode: ViewMode;
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testViewMode);

  viewMode = this.subject.asObservable();

  constructor(private searchLink: string = '/search') {
    this.setViewMode(ViewMode.List);
  }

  getViewMode(): Observable<ViewMode> {
    return this.viewMode;
  }

  setViewMode(viewMode: ViewMode) {
    this.testViewMode = viewMode;
  }

  getFacetValuesFor() {
    return null;
  }

  get testViewMode(): ViewMode {
    return this._viewMode;
  }

  set testViewMode(viewMode: ViewMode) {
    this._viewMode = viewMode;
    this.subject.next(viewMode);
  }

  getSearchLink() {
    return this.searchLink;
  }
}
