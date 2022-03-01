import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { getTestScheduler } from 'jasmine-marbles';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { SubmissionImportExternalComponent } from './submission-import-external.component';
import { ExternalSourceService } from '../../core/data/external-source.service';
import { getMockExternalSourceService } from '../../shared/mocks/external-source.service.mock';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { RouteService } from '../../core/services/route.service';
import { createPaginatedList, createTestComponent } from '../../shared/testing/utils.test';
import { RouterStub } from '../../shared/testing/router.stub';
import { VarDirective } from '../../shared/utils/var.directive';
import { routeServiceStub } from '../../shared/testing/route-service.stub';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';
import { SubmissionImportExternalPreviewComponent } from './import-external-preview/submission-import-external-preview.component';

describe('SubmissionImportExternalComponent test suite', () => {
  let comp: SubmissionImportExternalComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionImportExternalComponent>;
  let scheduler: TestScheduler;
  const ngbModal = jasmine.createSpyObj('modal', ['open']);
  const mockSearchOptions = observableOf(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      pageSize: 10,
      currentPage: 0
    }),
    query: 'test'
  }));
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };
  const mockExternalSourceService: any = getMockExternalSourceService();

  beforeEach(waitForAsync (() => {
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
        { provide: ExternalSourceService, useValue: mockExternalSourceService },
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
      scheduler = getTestScheduler();
      mockExternalSourceService.getExternalSourceEntries.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([])));
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('Should init component properly (without route data)', () => {
      const expectedEntries = createSuccessfulRemoteDataObject(createPaginatedList([]));
      comp.routeData = {entity: '', sourceId: '', query: '' };
      spyOn(compAsAny.routeService, 'getQueryParameterValue').and.returnValue(observableOf(''));
      fixture.detectChanges();

      expect(comp.routeData).toEqual({entity: '', sourceId: '', query: '' });
      expect(comp.isLoading$.value).toBe(false);
      expect(comp.entriesRD$.value).toEqual(expectedEntries);
    });

    it('Should init component properly (with route data)', () => {
      comp.routeData = {entity: '', sourceId: '', query: '' };
      spyOn(compAsAny, 'retrieveExternalSources');
      spyOn(compAsAny.routeService, 'getQueryParameterValue').and.returnValues(observableOf('entity'), observableOf('source'), observableOf('dummy'));
      fixture.detectChanges();

      expect(compAsAny.retrieveExternalSources).toHaveBeenCalled();
    });

    it('Should call \'getExternalSourceEntries\' properly', () => {
      spyOn(routeServiceStub, 'getQueryParameterValue').and.callFake((param) => {
        if (param === 'sourceId') {
          return observableOf('orcidV2');
        } else if (param === 'query') {
          return observableOf('test');
        }
        return observableOf({});
      });

      fixture.detectChanges();


      expect(comp.isLoading$.value).toBe(false);
      expect(compAsAny.externalService.getExternalSourceEntries).toHaveBeenCalled();
    });

    it('Should call \'router.navigate\'', () => {
      comp.routeData = {entity: 'Person', sourceId: '', query: '' };
      spyOn(compAsAny, 'retrieveExternalSources').and.callFake(() => null);
      compAsAny.router.navigate.and.returnValue( new Promise(() => {return;}));
      const event = {entity: 'Person', sourceId: 'orcidV2', query: 'dummy' };

      scheduler.schedule(() => comp.getExternalSourceData(event));
      scheduler.flush();

      expect(compAsAny.router.navigate).toHaveBeenCalledWith([], { queryParams: { entity: event.entity, sourceId: event.sourceId, query: event.query }, replaceUrl: true });
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

    it('Should set the correct label', () => {
      const label = 'Person';
      compAsAny.selectLabel(label);

      expect(comp.label).toEqual(label);
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
