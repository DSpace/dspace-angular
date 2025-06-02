import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from 'src/app/core/data/item-data.service';

import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { QualityAssuranceEventDataService } from '../../../core/notifications/qa/events/quality-assurance-event-data.service';
import { QualityAssuranceEventObject } from '../../../core/notifications/qa/models/quality-assurance-event.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import {
  getMockQualityAssuranceEventRestService,
  ItemMockPid8,
  ItemMockPid9,
  ItemMockPid10,
  NotificationsMockDspaceObject,
  qualityAssuranceEventObjectMissingProjectFound,
  qualityAssuranceEventObjectMissingProjectNotFound,
} from '../../../shared/mocks/notifications.mock';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { QualityAssuranceEventData } from '../project-entry-import-modal/project-entry-import-modal.component';
import { QualityAssuranceEventsComponent } from './quality-assurance-events.component';

describe('QualityAssuranceEventsComponent test suite', () => {
  let fixture: ComponentFixture<QualityAssuranceEventsComponent>;
  let comp: QualityAssuranceEventsComponent;
  let compAsAny: any;
  let scheduler: TestScheduler;

  const modalStub = {
    open: () => ( { result: new Promise((res, rej) => 'do') } ),
    close: () => null,
    dismiss: () => null,
  };
  const qualityAssuranceEventRestServiceStub: any = getMockQualityAssuranceEventRestService();
  const activatedRouteParams = {
    qualityAssuranceEventsParams: {
      currentPage: 0,
      pageSize: 10,
    },
  };
  const activatedRouteParamsMap = {
    id: 'ENRICH!MISSING!PROJECT',
  };

  const events: QualityAssuranceEventObject[] = [
    qualityAssuranceEventObjectMissingProjectFound,
    qualityAssuranceEventObjectMissingProjectNotFound,
  ];
  const paginationService = new PaginationServiceStub();

  function getQualityAssuranceEventData1(): QualityAssuranceEventData {
    return {
      event: qualityAssuranceEventObjectMissingProjectFound,
      id: qualityAssuranceEventObjectMissingProjectFound.id,
      title: qualityAssuranceEventObjectMissingProjectFound.title,
      hasProject: true,
      projectTitle: qualityAssuranceEventObjectMissingProjectFound.message.title,
      projectId: ItemMockPid10.id,
      handle: ItemMockPid10.handle,
      reason: null,
      isRunning: false,
      target: ItemMockPid8,
    };
  }

  function getQualityAssuranceEventData2(): QualityAssuranceEventData {
    return {
      event: qualityAssuranceEventObjectMissingProjectNotFound,
      id: qualityAssuranceEventObjectMissingProjectNotFound.id,
      title: qualityAssuranceEventObjectMissingProjectNotFound.title,
      hasProject: false,
      projectTitle: null,
      projectId: null,
      handle: null,
      reason: null,
      isRunning: false,
      target: ItemMockPid9,
    };
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        QualityAssuranceEventsComponent,
        TestComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub(activatedRouteParamsMap, activatedRouteParams) },
        { provide: QualityAssuranceEventDataService, useValue: qualityAssuranceEventRestServiceStub },
        { provide: NgbModal, useValue: modalStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: PaginationService, useValue: paginationService },
        { provide: ItemDataService, useValue: {} },
        { provide: AuthorizationDataService, useValue: {} },
        QualityAssuranceEventsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents().then();
    scheduler = getTestScheduler();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-quality-assurance-event></ds-quality-assurance-event>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create QualityAssuranceEventsComponent', inject([QualityAssuranceEventsComponent], (app: QualityAssuranceEventsComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(QualityAssuranceEventsComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    describe('fetchEvents', () => {
      it('should fetch events', () => {
        const result = compAsAny.fetchEvents(events);
        const expected = cold('(a|)', {
          a: [
            getQualityAssuranceEventData1(),
            getQualityAssuranceEventData2(),
          ],
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('modalChoice', () => {
      beforeEach(() => {
        spyOn(comp, 'executeAction');
        spyOn(comp, 'openModal');
      });

      it('should call executeAction if a project is present', () => {
        const action = 'ACCEPTED';
        comp.modalChoice(action, getQualityAssuranceEventData1(), modalStub);
        expect(comp.executeAction).toHaveBeenCalledWith(action, getQualityAssuranceEventData1());
      });

      it('should call openModal if a project is not present', () => {
        const action = 'ACCEPTED';
        comp.modalChoice(action, getQualityAssuranceEventData2(), modalStub);
        expect(comp.openModal).toHaveBeenCalledWith(action, getQualityAssuranceEventData2(), modalStub);
      });
    });

    describe('openModal', () => {
      it('should call modalService.open', () => {
        const action = 'ACCEPTED';
        comp.selectedReason = null;
        spyOn(compAsAny.modalService, 'open').and.returnValue({ result: new Promise((res, rej) => 'do' ) });
        spyOn(comp, 'executeAction');

        comp.openModal(action, getQualityAssuranceEventData1(), modalStub);
        expect(compAsAny.modalService.open).toHaveBeenCalled();
      });
    });

    describe('openModalLookup', () => {
      it('should call modalService.open', () => {
        spyOn(comp, 'boundProject');
        spyOn(compAsAny.modalService, 'open').and.returnValue(
          {
            componentInstance: {
              externalSourceEntry: null,
              label: null,
              importedObject: observableOf({
                indexableObject: NotificationsMockDspaceObject,
              }),
            },
          },
        );
        scheduler.schedule(() => {
          comp.openModalLookup(getQualityAssuranceEventData1());
        });
        scheduler.flush();

        expect(compAsAny.modalService.open).toHaveBeenCalled();
        expect(compAsAny.boundProject).toHaveBeenCalled();
      });
    });

    describe('executeAction', () => {
      it('should call getQualityAssuranceEvents on 200 response from REST', () => {
        const action = 'ACCEPTED';
        spyOn(compAsAny, 'getQualityAssuranceEvents').and.returnValue(observableOf([
          getQualityAssuranceEventData1(),
          getQualityAssuranceEventData2(),
        ]));
        qualityAssuranceEventRestServiceStub.patchEvent.and.returnValue(createSuccessfulRemoteDataObject$({}));

        scheduler.schedule(() => {
          comp.executeAction(action, getQualityAssuranceEventData1());
        });
        scheduler.flush();

        expect(compAsAny.getQualityAssuranceEvents).toHaveBeenCalled();
      });
    });

    describe('boundProject', () => {
      it('should populate the project data inside "eventData"', () => {
        const eventData = getQualityAssuranceEventData2();
        const projectId = 'UUID-23943-34u43-38344';
        const projectName = 'Test Project';
        const projectHandle = '1000/1000';
        qualityAssuranceEventRestServiceStub.boundProject.and.returnValue(createSuccessfulRemoteDataObject$({}));

        scheduler.schedule(() => {
          comp.boundProject(eventData, projectId, projectName, projectHandle);
        });
        scheduler.flush();

        expect(eventData.hasProject).toEqual(true);
        expect(eventData.projectId).toEqual(projectId);
        expect(eventData.projectTitle).toEqual(projectName);
        expect(eventData.handle).toEqual(projectHandle);
      });
    });

    describe('removeProject', () => {
      it('should remove the project data inside "eventData"', () => {
        const eventData = getQualityAssuranceEventData1();
        qualityAssuranceEventRestServiceStub.removeProject.and.returnValue(createNoContentRemoteDataObject$());

        scheduler.schedule(() => {
          comp.removeProject(eventData);
        });
        scheduler.flush();

        expect(eventData.hasProject).toEqual(false);
        expect(eventData.projectId).toBeNull();
        expect(eventData.projectTitle).toBeNull();
        expect(eventData.handle).toBeNull();
      });
    });

    describe('getQualityAssuranceEvents', () => {
      it('should call the "qualityAssuranceEventRestService.getEventsByTopic" to take data and "fetchEvents" to populate eventData', () => {
        comp.paginationConfig = new PaginationComponentOptions();
        comp.paginationConfig.currentPage = 1;
        comp.paginationConfig.pageSize = 20;
        comp.paginationSortConfig = new SortOptions('trust', SortDirection.DESC);
        comp.topic = activatedRouteParamsMap.id;
        const options: FindListOptions = Object.assign(new FindListOptions(), {
          currentPage: comp.paginationConfig.currentPage,
          elementsPerPage: comp.paginationConfig.pageSize,
        });

        const pageInfo = new PageInfo({
          elementsPerPage: comp.paginationConfig.pageSize,
          totalElements: 2,
          totalPages: 1,
          currentPage: comp.paginationConfig.currentPage,
        });
        const array =  [
          qualityAssuranceEventObjectMissingProjectFound,
          qualityAssuranceEventObjectMissingProjectNotFound,
        ];
        const paginatedList = buildPaginatedList(pageInfo, array);
        const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
        qualityAssuranceEventRestServiceStub.getEventsByTopic.and.returnValue(observableOf(paginatedListRD));
        spyOn(compAsAny, 'fetchEvents').and.returnValue(observableOf([
          getQualityAssuranceEventData1(),
          getQualityAssuranceEventData2(),
        ]));

        scheduler.schedule(() => {
          compAsAny.getQualityAssuranceEvents().subscribe();
        });
        scheduler.flush();

        expect(compAsAny.qualityAssuranceEventRestService.getEventsByTopic).toHaveBeenCalledWith(
          activatedRouteParamsMap.id,
          options,
          followLink('target'),followLink('related'),
        );
        expect(compAsAny.fetchEvents).toHaveBeenCalled();
      });
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [CommonModule],
})
class TestComponent {

}
