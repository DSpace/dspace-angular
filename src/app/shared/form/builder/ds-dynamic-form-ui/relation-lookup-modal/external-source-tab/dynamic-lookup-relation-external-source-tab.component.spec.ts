import {
  EventEmitter,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ExternalSourceDataService } from '@dspace/core/data/external-source-data.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { ExternalSource } from '@dspace/core/shared/external-source.model';
import { ExternalSourceEntry } from '@dspace/core/shared/external-source-entry.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemType } from '@dspace/core/shared/item-relationships/item-type.model';
import { RelationshipOptions } from '@dspace/core/shared/relationship-options.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  of,
} from 'rxjs';

import { ErrorComponent } from '../../../../../error/error.component';
import { ThemedLoadingComponent } from '../../../../../loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../object-collection/object-collection.component';
import { SelectableListService } from '../../../../../object-list/selectable-list/selectable-list.service';
import { PageSizeSelectorComponent } from '../../../../../page-size-selector/page-size-selector.component';
import { SearchConfigurationService } from '../../../../../search/search-configuration.service';
import { ThemedSearchFormComponent } from '../../../../../search-form/themed-search-form.component';
import { VarDirective } from '../../../../../utils/var.directive';
import { DsDynamicLookupRelationExternalSourceTabComponent } from './dynamic-lookup-relation-external-source-tab.component';
import { ThemedExternalSourceEntryImportModalComponent } from './external-source-entry-import-modal/themed-external-source-entry-import-modal.component';

describe('DsDynamicLookupRelationExternalSourceTabComponent', () => {
  let component: DsDynamicLookupRelationExternalSourceTabComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationExternalSourceTabComponent>;
  let pSearchOptions;
  let externalSourceService;
  let selectableListService;
  let modalService;

  const itemType = Object.assign(new ItemType(), { label: 'Person' });
  const externalSource = {
    id: 'orcidV2',
    name: 'orcidV2',
    hierarchical: false,
    entityTypes: createSuccessfulRemoteDataObject$(createPaginatedList([itemType])),
  } as ExternalSource;
  const externalEntries = [
    Object.assign({
      id: '0001-0001-0001-0001',
      display: 'John Doe',
      value: 'John, Doe',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0001',
          },
        ],
      },
    }),
    Object.assign({
      id: '0001-0001-0001-0002',
      display: 'Sampson Megan',
      value: 'Sampson, Megan',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0002',
          },
        ],
      },
    }),
    Object.assign({
      id: '0001-0001-0001-0003',
      display: 'Edwards Anna',
      value: 'Edwards, Anna',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0003',
          },
        ],
      },
    }),
  ] as ExternalSourceEntry[];
  const item = Object.assign(new Item(), { id: 'submission-item' });
  const collection = Object.assign(new Collection(), { id: 'submission-collection' });
  const relationship = Object.assign(new RelationshipOptions(), { relationshipType: 'isAuthorOfPublication' });
  const label = 'Author';

  function init() {
    pSearchOptions = new PaginatedSearchOptions({
      query: 'test',
    });
    externalSourceService = jasmine.createSpyObj('externalSourceService', {
      getExternalSourceEntries: createSuccessfulRemoteDataObject$(createPaginatedList(externalEntries)),
    });
    selectableListService = jasmine.createSpyObj('selectableListService', ['selectSingle']);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule,
        BrowserAnimationsModule, DsDynamicLookupRelationExternalSourceTabComponent, VarDirective],
      providers: [
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: of(pSearchOptions),
          },
        },
        { provide: ExternalSourceDataService, useValue: externalSourceService },
        { provide: SelectableListService, useValue: selectableListService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsDynamicLookupRelationExternalSourceTabComponent, {
        remove: {
          imports: [
            ThemedSearchFormComponent,
            PageSizeSelectorComponent,
            ObjectCollectionComponent,
            ErrorComponent,
            ThemedLoadingComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationExternalSourceTabComponent);
    component = fixture.componentInstance;
    component.externalSource = externalSource;
    component.item = item;
    component.collection = collection;
    component.relationship = relationship;
    component.label = label;
    modalService = (component as any).modalService;
    fixture.detectChanges();
  });

  describe('when the external entries finished loading successfully', () => {
    it('should display a ds-viewable-collection component', () => {
      const viewableCollection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(viewableCollection).toBeDefined();
    });
  });

  describe('when the external entries are loading', () => {
    beforeEach(() => {
      component.entriesRD$ = createPendingRemoteDataObject$();
      fixture.detectChanges();
    });

    it('should not display a ds-viewable-collection component', () => {
      const viewableCollection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(viewableCollection).toBeNull();
    });

    it('should display a ds-themed-loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading).not.toBeNull();
    });
  });

  describe('when the external entries failed loading', () => {
    beforeEach(() => {
      component.entriesRD$ = createFailedRemoteDataObject$('server error', 500);
      fixture.detectChanges();
    });

    it('should not display a ds-viewable-collection component', () => {
      const viewableCollection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(viewableCollection).toBeNull();
    });

    it('should display a ds-error component', () => {
      const error = fixture.debugElement.query(By.css('ds-error'));
      expect(error).not.toBeNull();
    });
  });

  describe('when the external entries return an empty list', () => {
    beforeEach(() => {
      component.entriesRD$ = createSuccessfulRemoteDataObject$(createPaginatedList([]));
      fixture.detectChanges();
    });

    it('should not display a ds-viewable-collection component', () => {
      const viewableCollection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(viewableCollection).toBeNull();
    });

    it('should display a message the list is empty', () => {
      const empty = fixture.debugElement.query(By.css('#empty-external-entry-list'));
      expect(empty).not.toBeNull();
    });
  });

  describe('import', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ importedObject: new EventEmitter<any>(), compRef$: EMPTY }) }));
      component.modalRef = modalService.open(ThemedExternalSourceEntryImportModalComponent, { size: 'lg', container: 'ds-dynamic-lookup-relation-modal' });
      component.import(externalEntries[0]);
    });

    it('should open a new ExternalSourceEntryImportModalComponent', () => {
      expect(modalService.open).toHaveBeenCalledWith(ThemedExternalSourceEntryImportModalComponent, jasmine.any(Object));
    });
  });
});
