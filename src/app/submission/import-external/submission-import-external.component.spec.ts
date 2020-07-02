import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf, of } from 'rxjs/internal/observable/of';
import { SubmissionImportExternalComponent } from './submission-import-external.component';
import { ExternalSourceService } from '../../core/data/external-source.service';
import { getMockExternalSourceService } from '../../shared/mocks/external-source.service.mock';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { RouteService } from '../../core/services/route.service';
import { createTestComponent, createPaginatedList } from '../../shared/testing/utils.test';
import { RouterStub } from '../../shared/testing/router.stub';
import { VarDirective } from '../../shared/utils/var.directive';
import { routeServiceStub } from '../../shared/testing/route-service.stub';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';
import { SubmissionImportExternalPreviewComponent } from './import-external-preview/submission-import-external-preview.component';

describe('SubmissionImportExternalComponent test suite', () => {
  let comp: SubmissionImportExternalComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionImportExternalComponent>;
  const ngbModal = jasmine.createSpyObj('modal', ['open']);
  const mockSearchOptions = of(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      pageSize: 10,
      currentPage: 0
    })
  }));
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        SubmissionImportExternalComponent,
        TestComponent,
        VarDirective
      ],
      providers: [
        { provide: ExternalSourceService, useClass: getMockExternalSourceService },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: NgbModal, useValue: ngbModal },
        SubmissionImportExternalComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-import-external></ds-submission-import-external>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionImportExternalComponent', inject([SubmissionImportExternalComponent], (app: SubmissionImportExternalComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionImportExternalComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('Should init component properly (without route data)', () => {
      const expectedEntries = createSuccessfulRemoteDataObject(createPaginatedList([]));
      spyOn(compAsAny.routeService, 'getQueryParameterValue').and.returnValue(observableOf(''));
      fixture.detectChanges();

      expect(comp.routeData).toEqual({ sourceId: '', query: '' });
      expect(comp.isLoading$.value).toBe(false);
      expect(comp.entriesRD$.value).toEqual(expectedEntries);
    });

    it('Should init component properly (with route data)', () => {
      const expectedEntries = createSuccessfulRemoteDataObject(createPaginatedList([]));
      const searchOptions = new PaginatedSearchOptions({
        pagination: Object.assign(new PaginationComponentOptions(), {
          pageSize: 10,
          currentPage: 0
        })
      });
      spyOn(compAsAny.routeService, 'getQueryParameterValue').and.returnValue(observableOf('dummy'));
      fixture.detectChanges();

      expect(comp.routeData).toEqual({ sourceId: 'dummy', query: 'dummy' });
      expect(comp.isLoading$.value).toBe(true);
      expect(comp.entriesRD$.value).toEqual(expectedEntries);
      expect(compAsAny.externalService.getExternalSourceEntries).toHaveBeenCalledWith('dummy', searchOptions);
    });

    it('Should call \'router.navigate\'', () => {
      const event = { sourceId: 'orcidV2', query: 'dummy' };
      comp.getExternalsourceData(event);

      expect(compAsAny.router.navigate).toHaveBeenCalledWith([], { queryParams: { source: event.sourceId, query: event.query }, replaceUrl: true });
    });

    it('Entry should be passed to the component loaded inside the modal', () => {
      const entry = Object.assign(new ExternalSourceEntry(), {
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
      });
      ngbModal.open.and.returnValue({componentInstance: { externalSourceEntry: null}});
      comp.import(entry);

      expect(compAsAny.modalService.open).toHaveBeenCalledWith(SubmissionImportExternalPreviewComponent, { size: 'lg' });
      expect(comp.modalRef.componentInstance.externalSourceEntry).toEqual(entry);
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
