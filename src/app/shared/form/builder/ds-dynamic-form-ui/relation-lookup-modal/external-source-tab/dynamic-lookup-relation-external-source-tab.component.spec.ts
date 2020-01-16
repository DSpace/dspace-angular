import { DsDynamicLookupRelationExternalSourceTabComponent } from './dynamic-lookup-relation-external-source-tab.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VarDirective } from '../../../../../utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import {
  createFailedRemoteDataObject$,
  createPaginatedList,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../../../../../testing/utils';
import { ExternalSourceService } from '../../../../../../core/data/external-source.service';
import { ExternalSource } from '../../../../../../core/shared/external-source.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ExternalSourceEntry } from '../../../../../../core/shared/external-source-entry.model';

describe('DsDynamicLookupRelationExternalSourceTabComponent', () => {
  let component: DsDynamicLookupRelationExternalSourceTabComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationExternalSourceTabComponent>;
  let pSearchOptions;
  let externalSourceService;

  const externalSource = {
    id: 'orcidV2',
    name: 'orcidV2',
    hierarchical: false
  } as ExternalSource;
  const externalEntries = [
    Object.assign({
      id: '0001-0001-0001-0001',
      display: 'John Doe',
      value: 'John, Doe',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0001'
          }
        ]
      }
    }),
    Object.assign({
      id: '0001-0001-0001-0002',
      display: 'Sampson Megan',
      value: 'Sampson, Megan',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0002'
          }
        ]
      }
    }),
    Object.assign({
      id: '0001-0001-0001-0003',
      display: 'Edwards Anna',
      value: 'Edwards, Anna',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0003'
          }
        ]
      }
    })
  ] as ExternalSourceEntry[];

  function init() {
    pSearchOptions = new PaginatedSearchOptions({
      query: 'test'
    });
    externalSourceService = jasmine.createSpyObj('externalSourceService', {
      getExternalSourceEntries: createSuccessfulRemoteDataObject$(createPaginatedList(externalEntries))
    });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicLookupRelationExternalSourceTabComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      providers: [
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: observableOf(pSearchOptions)
          }
        },
        { provide: ExternalSourceService, useValue: externalSourceService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationExternalSourceTabComponent);
    component = fixture.componentInstance;
    component.externalSource = externalSource;
    fixture.detectChanges();
  });

  describe('when the external entries finished loading successfully', () => {
    it('should display a ds-viewable-collection component', () => {
      const collection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(collection).toBeDefined();
    });
  });

  describe('when the external entries are loading', () => {
    beforeEach(() => {
      component.entriesRD$ = createPendingRemoteDataObject$(undefined);
      fixture.detectChanges();
    });

    it('should not display a ds-viewable-collection component', () => {
      const collection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(collection).toBeNull();
    });

    it('should display a ds-loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading).not.toBeNull();
    });
  });

  describe('when the external entries failed loading', () => {
    beforeEach(() => {
      component.entriesRD$ = createFailedRemoteDataObject$(undefined);
      fixture.detectChanges();
    });

    it('should not display a ds-viewable-collection component', () => {
      const collection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(collection).toBeNull();
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
      const collection = fixture.debugElement.query(By.css('ds-viewable-collection'));
      expect(collection).toBeNull();
    });

    it('should display a message the list is empty', () => {
      const empty = fixture.debugElement.query(By.css('#empty-external-entry-list'));
      expect(empty).not.toBeNull();
    });
  });
});
