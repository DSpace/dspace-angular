import { CdkTreeModule } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PageInfo } from '../../../core/shared/page-info.model';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyService } from '../../../core/submission/vocabularies/vocabulary.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createTestComponent } from '../../testing/utils.test';
import { FormFieldMetadataValueObject } from '../builder/models/form-field-metadata-value.model';
import { VocabularyTreeviewComponent } from './vocabulary-treeview.component';
import { VocabularyTreeviewService } from './vocabulary-treeview.service';
import {
  TreeviewFlatNode,
  TreeviewNode,
} from './vocabulary-treeview-node.model';

describe('VocabularyTreeviewComponent test suite', () => {

  let comp: VocabularyTreeviewComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<VocabularyTreeviewComponent>;
  let de;

  const item = new VocabularyEntryDetail();
  item.id = 'node1';
  const item2 = new VocabularyEntryDetail();
  item2.id = 'node2';
  const emptyNodeMap = new Map<string, TreeviewFlatNode>();
  const storedNodeMap = new Map<string, TreeviewFlatNode>().set('test', new TreeviewFlatNode(item2));
  const nodeMap = new Map<string, TreeviewFlatNode>().set('test', new TreeviewFlatNode(item));
  const vocabularyOptions = new VocabularyOptions('vocabularyTest', false);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const vocabularyTreeviewServiceStub = jasmine.createSpyObj('VocabularyTreeviewService', {
    initialize: jasmine.createSpy('initialize'),
    getData: jasmine.createSpy('getData'),
    loadMore: jasmine.createSpy('loadMore'),
    loadMoreRoot: jasmine.createSpy('loadMoreRoot'),
    isLoading: jasmine.createSpy('isLoading'),
    searchByQuery: jasmine.createSpy('searchByQuery'),
    restoreNodes: jasmine.createSpy('restoreNodes'),
    cleanTree: jasmine.createSpy('cleanTree'),
  });
  const vocabularyServiceStub = jasmine.createSpyObj('VocabularyService', {
    getVocabularyEntriesByValue: jasmine.createSpy('getVocabularyEntriesByValue'),
    getEntryDetailParent: jasmine.createSpy('getEntryDetailParent'),
    findEntryDetailById: jasmine.createSpy('findEntryDetailById'),
    searchTopEntries: jasmine.createSpy('searchTopEntries'),
    getEntryDetailChildren: jasmine.createSpy('getEntryDetailChildren'),
    clearSearchTopRequests: jasmine.createSpy('clearSearchTopRequests'),
    findVocabularyById: createSuccessfulRemoteDataObject$({ preloadLevel: 2 }),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CdkTreeModule,
        TranslateModule.forRoot(),
        VocabularyTreeviewComponent,
        TestComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: VocabularyTreeviewService, useValue: vocabularyTreeviewServiceStub },
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: NgbActiveModal, useValue: modalStub },
        ChangeDetectorRef,
        VocabularyTreeviewComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents().then(() => {
      vocabularyTreeviewServiceStub.getData.and.returnValue(of([]));
      vocabularyTreeviewServiceStub.isLoading.and.returnValue(of(false));
    });
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {

      const html = `
        <ds-vocabulary-treeview [vocabularyOptions]="vocabularyOptions" [preloadLevel]="preloadLevel"></ds-vocabulary-treeview>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      vocabularyTreeviewServiceStub.getData.and.returnValue(of([]));
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create VocabularyTreeviewComponent', inject([VocabularyTreeviewComponent], (app: VocabularyTreeviewComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(VocabularyTreeviewComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      comp.vocabularyOptions = vocabularyOptions;
      comp.selectedItems = [];
    });

    it('should should init component properly', () => {
      fixture.detectChanges();
      expect(comp.dataSource.data).toEqual([]);
      expect(vocabularyTreeviewServiceStub.initialize).toHaveBeenCalled();
    });

    it('should should init component properly with init value as FormFieldMetadataValueObject', () => {
      const currentValue = new FormFieldMetadataValueObject();
      currentValue.value = 'testValue';
      currentValue.otherInformation = {
        id: 'entryID',
      };
      comp.selectedItems = [currentValue];
      fixture.detectChanges();
      expect(comp.dataSource.data).toEqual([]);
      expect(vocabularyTreeviewServiceStub.initialize).toHaveBeenCalledWith(comp.vocabularyOptions, new PageInfo(), ['entryID'], 'entryID');
    });

    it('should should init component properly with init value as VocabularyEntry', () => {
      const currentValue = new VocabularyEntry();
      currentValue.value = 'testValue';
      currentValue.otherInformation = {
        id: 'entryID',
      };
      comp.selectedItems = [currentValue];
      fixture.detectChanges();
      expect(comp.dataSource.data).toEqual([]);
      expect(vocabularyTreeviewServiceStub.initialize).toHaveBeenCalledWith(comp.vocabularyOptions, new PageInfo(), ['entryID'], 'entryID');
    });

    it('should should init component properly with init value as VocabularyEntryDetail', () => {
      const currentValue = new VocabularyEntryDetail();
      currentValue.value = 'testValue';
      currentValue.id = 'entryID';
      comp.selectedItems = [currentValue];
      fixture.detectChanges();
      expect(comp.dataSource.data).toEqual([]);
      expect(vocabularyTreeviewServiceStub.initialize).toHaveBeenCalledWith(comp.vocabularyOptions, new PageInfo(), ['entryID'], 'entryID');
    });

    it('should call loadMore function', () => {
      comp.loadMore(item);
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.loadMore).toHaveBeenCalledWith(item, []);
    });

    it('should call loadMoreRoot function', () => {
      const node = new TreeviewFlatNode(item);
      comp.loadMoreRoot(node);
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.loadMoreRoot).toHaveBeenCalledWith(node, []);
    });

    it('should call loadChildren function', () => {
      const node = new TreeviewFlatNode(item);
      comp.loadChildren(node);
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.loadMore).toHaveBeenCalledWith(node.item, [], true);
    });

    it('should emit select event', () => {
      spyOn(comp, 'onSelect');
      comp.onSelect(item);

      expect(comp.onSelect).toHaveBeenCalledWith(item);
    });

    it('should call searchByQuery function and set storedNodeMap properly', () => {
      comp.searchText = 'test search';
      comp.nodeMap.set('test', new TreeviewFlatNode(item));
      comp.search();
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.searchByQuery).toHaveBeenCalledWith('test search', []);
      expect(comp.storedNodeMap).toEqual(nodeMap);
      expect(comp.nodeMap).toEqual(emptyNodeMap);
    });

    it('should call searchByQuery function and not set storedNodeMap', () => {
      comp.searchText = 'test search';
      comp.nodeMap.set('test', new TreeviewFlatNode(item));
      comp.storedNodeMap.set('test', new TreeviewFlatNode(item2));
      comp.search();
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.searchByQuery).toHaveBeenCalledWith('test search', []);
      expect(comp.storedNodeMap).toEqual(storedNodeMap);
      expect(comp.nodeMap).toEqual(emptyNodeMap);
    });

    it('should call restoreNodes function and restore nodeMap properly', () => {
      comp.nodeMap.set('test', new TreeviewFlatNode(item));
      comp.storedNodeMap.set('test', new TreeviewFlatNode(item2));
      comp.reset();
      fixture.detectChanges();
      expect(vocabularyTreeviewServiceStub.restoreNodes).toHaveBeenCalled();
      expect(comp.storedNodeMap).toEqual(emptyNodeMap);
      expect(comp.nodeMap).toEqual(storedNodeMap);
      expect(comp.searchText).toEqual('');
    });

    it('should clear search string', () => {
      comp.nodeMap.set('test', new TreeviewFlatNode(item));
      comp.reset();
      fixture.detectChanges();
      expect(comp.storedNodeMap).toEqual(emptyNodeMap);
      expect(comp.nodeMap).toEqual(nodeMap);
      expect(comp.searchText).toEqual('');
    });

    it('should call cleanTree method on destroy', () => {
      compAsAny.ngOnDestroy();
      expect(vocabularyTreeviewServiceStub.cleanTree).toHaveBeenCalled();
    });
  });

  describe('', () => {
    beforeEach(() => {
      vocabularyTreeviewServiceStub.getData.and.returnValue(of([
        {
          'item': {
            'id': 'srsc:SCB11',
            'display': 'HUMANITIES and RELIGION',
          },
        } as TreeviewNode,
        {
          'item': {
            'id': 'srsc:SCB12',
            'display': 'LAW/JURISPRUDENCE',
          },
        } as TreeviewNode,
        {
          'item': {
            'id': 'srsc:SCB13',
            'display': 'SOCIAL SCIENCES',
          },
        } as TreeviewNode,
      ]));
      fixture = TestBed.createComponent(VocabularyTreeviewComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      comp.vocabularyOptions = vocabularyOptions;
      comp.selectedItems = [];
      de = fixture.debugElement;
    });

    it('should not display checkboxes by default', async () => {
      fixture.detectChanges();
      expect(de.query(By.css('input[type=checkbox]'))).toBeNull();
      expect(de.queryAll(By.css('cdk-tree-node')).length).toEqual(3);
    });

    it('should display checkboxes if multiSelect is true', async () => {
      comp.multiSelect = true;
      fixture.detectChanges();
      expect(de.queryAll(By.css('input[type=checkbox]')).length).toEqual(3);
      expect(de.queryAll(By.css('cdk-tree-node')).length).toEqual(3);
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    CdkTreeModule,
  ],
})
class TestComponent {

  vocabularyOptions: VocabularyOptions = new VocabularyOptions('vocabularyTest', false);
  preloadLevel = 2;

}
