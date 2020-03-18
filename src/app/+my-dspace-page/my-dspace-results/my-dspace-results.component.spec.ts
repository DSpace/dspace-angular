import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { QueryParamsDirectiveStub } from '../../shared/testing/query-params-directive.stub';
import { MyDSpaceResultsComponent } from './my-dspace-results.component';

describe('MyDSpaceResultsComponent', () => {
  let comp: MyDSpaceResultsComponent;
  let fixture: ComponentFixture<MyDSpaceResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [
        MyDSpaceResultsComponent,
        QueryParamsDirectiveStub],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpaceResultsComponent);
    comp = fixture.componentInstance; // MyDSpaceResultsComponent test instance
  });

  it('should display results when results are not empty', () => {
    (comp as any).searchResults = { hasSucceeded: true, isLoading: false, payload: { page: { length: 2 } } };
    (comp as any).searchConfig = {};
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-viewable-collection'))).not.toBeNull();
  });

  it('should not display link when results are not empty', () => {
    (comp as any).searchResults = { hasSucceeded: true, isLoading: false, payload: { page: { length: 2 } } };
    (comp as any).searchConfig = {};
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('a'))).toBeNull();
  });

  it('should display error message if error is != 400', () => {
    (comp as any).searchResults = { hasFailed: true, error: { statusCode: 500 } };
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-error'))).not.toBeNull();
  });

  it('should display a message if search result is empty', () => {
    (comp as any).searchResults = { payload: { page: { length: 0 } } };
    (comp as any).searchConfig = { query: 'foobar' };
    fixture.detectChanges();

    const linkDes = fixture.debugElement.queryAll(By.css('text-muted'));

    expect(linkDes).toBeDefined()
  });
});
