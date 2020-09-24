import { Component, NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { async, TestBed, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { SubmissionImportExternalSearchbarComponent, SourceElement } from './submission-import-external-searchbar.component';
import { ExternalSourceService } from '../../../core/data/external-source.service';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { getMockExternalSourceService, externalSourceOrcid, externalSourceCiencia, externalSourceMyStaffDb } from '../../../shared/mocks/external-source.service.mock';
import { PageInfo } from '../../../core/shared/page-info.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { ExternalSource } from '../../../core/shared/external-source.model';
import { FindListOptions } from '../../../core/data/request.models';
import { HostWindowService } from '../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

describe('SubmissionImportExternalSearchbarComponent test suite', () => {
  let comp: SubmissionImportExternalSearchbarComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionImportExternalSearchbarComponent>;
  let scheduler: TestScheduler;

  beforeEach(async (() => {
    scheduler = getTestScheduler();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        SubmissionImportExternalSearchbarComponent,
        TestComponent,
      ],
      providers: [
        { provide: ExternalSourceService, useClass: getMockExternalSourceService },
        ChangeDetectorRef,
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        SubmissionImportExternalSearchbarComponent
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
        <ds-submission-import-external-searchbar></ds-submission-import-external-searchbar>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionImportExternalSearchbarComponent', inject([SubmissionImportExternalSearchbarComponent], (app: SubmissionImportExternalSearchbarComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    let sourceList: SourceElement[];
    let paginatedList: PaginatedList<ExternalSource>;

    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionImportExternalSearchbarComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      const pageInfo = new PageInfo();
      paginatedList = new PaginatedList(pageInfo, [externalSourceOrcid, externalSourceCiencia, externalSourceMyStaffDb]);
      const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
      compAsAny.externalService.findAll.and.returnValue(observableOf(paginatedListRD));
      sourceList = [
        {id: 'orcid', name: 'orcid'},
        {id: 'ciencia', name: 'ciencia'},
        {id: 'my_staff_db', name: 'my_staff_db'},
      ];
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('Should init component properly (without initExternalSourceData)', () => {
      comp.initExternalSourceData = { sourceId: '', query: '' };
      scheduler.schedule(() => fixture.detectChanges());
      scheduler.flush();

      expect(comp.selectedElement).toEqual(sourceList[0]);
      expect(compAsAny.pageInfo).toEqual(paginatedList.pageInfo);
      expect(comp.sourceList).toEqual(sourceList);
    });

    it('Should init component properly (with initExternalSourceData populated)', () => {
      comp.initExternalSourceData = { query: 'dummy', sourceId: 'ciencia' };
      scheduler.schedule(() => fixture.detectChanges());
      scheduler.flush();

      expect(comp.selectedElement).toEqual(sourceList[1]);
      expect(compAsAny.pageInfo).toEqual(paginatedList.pageInfo);
      expect(comp.sourceList).toEqual(sourceList);
    });

    it('Variable \'selectedElement\' should be assigned', () => {
      const selectedElement = {id: 'orcid', name: 'orcid'};
      comp.makeSourceSelection(selectedElement);
      expect(comp.selectedElement).toEqual(selectedElement);
    });

    it('Should load additional external sources', () => {
      comp.sourceListLoading = false;
      compAsAny.pageInfo = new PageInfo({
        elementsPerPage: 3,
        totalElements: 6,
        totalPages: 2,
        currentPage: 0
      });
      compAsAny.findListOptions = Object.assign({}, new FindListOptions(), {
        elementsPerPage: 3,
        currentPage: 0,
      });
      comp.sourceList = sourceList;
      const expected = sourceList.concat(sourceList);

      scheduler.schedule(() => comp.onScroll());
      scheduler.flush();

      expect(comp.sourceList).toEqual(expected);
    });

    it('The \'search\' method should call \'emit\'', () => {
      comp.selectedElement = { id: 'orcidV2', name: 'orcidV2' };
      comp.searchString = 'dummy';
      const expected = { sourceId: comp.selectedElement.id, query: comp.searchString };
      spyOn(comp.externalSourceData, 'emit');
      comp.search();

      expect(comp.externalSourceData.emit).toHaveBeenCalledWith(expected);
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
