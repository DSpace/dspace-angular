import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { createTestComponent } from '../testing/utils';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { AuthorityTreeviewComponent } from './authority-treeview.component';
import { AuthorityTreeviewService } from './authority-treeview.service';
import { MaterialModule } from '../material/material.module';
import { CoreState } from '../../core/core.reducers';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { TreeviewFlatNode } from './authority-treeview-node.model';

fdescribe('AuthorityTreeviewComponent test suite', () => {

  let comp: AuthorityTreeviewComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<AuthorityTreeviewComponent>;

  const searchOptions = new IntegrationSearchOptions('123456', 'authorityTest', 'metadata.test');
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const authorityTreeviewServiceStub = jasmine.createSpyObj('authorityTreeviewServiceStub', {
    initialize: jasmine.createSpy('initialize'),
    getData: jasmine.createSpy('getData'),
    loadMore: jasmine.createSpy('loadMore'),
    loadMoreRoot: jasmine.createSpy('loadMoreRoot'),
    isSearching: jasmine.createSpy('isSearching'),
    searchBy: jasmine.createSpy('searchBy'),
    restoreNodes: jasmine.createSpy('restoreNodes'),
  });

  const store: Store<CoreState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    pipe: observableOf(true),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AuthorityTreeviewComponent,
        TestComponent
      ],
      providers: [
        { provide: AuthorityTreeviewService, useValue: authorityTreeviewServiceStub },
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: Store, useValue: store },
        ChangeDetectorRef,
        AuthorityTreeviewComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-authority-treeview [searchOptions]="searchOptions" [preloadLevel]="preloadLevel"></ds-authority-treeview>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      authorityTreeviewServiceStub.getData.and.returnValue(observableOf([]));
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create AuthorityTreeviewComponent', inject([AuthorityTreeviewComponent], (app: AuthorityTreeviewComponent) => {
      expect(app).toBeDefined();
    }));
  });

  fdescribe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AuthorityTreeviewComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      authorityTreeviewServiceStub.getData.and.returnValue(observableOf([]));
      authorityTreeviewServiceStub.isSearching.and.returnValue(observableOf(false));
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should should init component properly', () => {
      fixture.detectChanges();
      expect(comp.dataSource.data).toEqual([]);
      expect(authorityTreeviewServiceStub.initialize).toHaveBeenCalled();
    });

    it('should call loadMore function', () => {
      const item = new AuthorityEntry();
      comp.loadMore(item);
      fixture.detectChanges();
      expect(authorityTreeviewServiceStub.loadMore).toHaveBeenCalledWith(item);
    });

    it('should call loadMoreRoot function', () => {
      const item = new AuthorityEntry();
      const node = new TreeviewFlatNode(item);
      comp.loadMoreRoot(node);
      fixture.detectChanges();
      expect(authorityTreeviewServiceStub.loadMoreRoot).toHaveBeenCalledWith(node);
    });

    it('should call loadChildren function', () => {
      const item = new AuthorityEntry();
      const node = new TreeviewFlatNode(item);
      comp.loadChildren(node);
      fixture.detectChanges();
      expect(authorityTreeviewServiceStub.loadMore).toHaveBeenCalledWith(node.item, true);
    });

    it('should emit select event', () => {
      spyOn(comp, 'onSelect');
      const item = new AuthorityEntry();
      comp.onSelect(item);

      expect(comp.onSelect).toHaveBeenCalledWith(item);
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions();
  preloadLevel = 2;

}
