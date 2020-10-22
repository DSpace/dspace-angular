import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { OpenaireBrokerEventRestService } from '../../core/openaire/openaire-broker-event-rest.service';
import { OpenaireBrokerEventComponent } from './openaire-broker-event.component';
import {
  getMockOpenaireBrokerEventRestService,
  ItemMockPid10,
  openaireBrokerEventObjectMissingProjectFound,
  openaireBrokerEventObjectMissingProjectNotFound,
  OpenaireMockDspaceObject
} from '../../shared/mocks/openaire.mock';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { createTestComponent } from '../../shared/testing/utils.test';
import { map } from 'rxjs/operators';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { OpenaireBrokerEventObject } from '../../core/openaire/models/openaire-broker-event.model';
import { OpenaireBrokerEventData, ProjectEntryImportModalComponent } from './project-entry-import-modal/project-entry-import-modal.component';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { RestResponse } from '../../core/cache/response.models';

fdescribe('OpenaireBrokerEventComponent test suite', () => {
  let fixture: ComponentFixture<OpenaireBrokerEventComponent>;
  let comp: OpenaireBrokerEventComponent;
  let compAsAny: any;

  const modalStub = {
      open: () => ( {result: new Promise((res, rej) => 'do')} ),
      close: () => null,
      dismiss: () => null
  };
  const openaireBrokerEventRestServiceStub: any = getMockOpenaireBrokerEventRestService();
  const activatedRouteParams = {
    openaireBrokerTopicsParams: {
      currentPage: 0,
      pageSize: 10
    }
  };
  const activatedRouteParamsMap = {
    id: 'ENRICH!MISSING!PROJECT'
  };

  const events: OpenaireBrokerEventObject[] = [
    openaireBrokerEventObjectMissingProjectFound,
    openaireBrokerEventObjectMissingProjectNotFound
  ];

  const openAireBrokerEventData1: OpenaireBrokerEventData = {
    event: openaireBrokerEventObjectMissingProjectFound,
    id: openaireBrokerEventObjectMissingProjectFound.id,
    title: openaireBrokerEventObjectMissingProjectFound.title,
    hasProject: true,
    projectTitle: openaireBrokerEventObjectMissingProjectFound.message.title,
    projectId: ItemMockPid10.id,
    handle: ItemMockPid10.handle,
    reason: null,
    isRunning: false
  };

  const openAireBrokerEventData2: OpenaireBrokerEventData = {
    event: openaireBrokerEventObjectMissingProjectNotFound,
    id: openaireBrokerEventObjectMissingProjectNotFound.id,
    title: openaireBrokerEventObjectMissingProjectNotFound.title,
    hasProject: false,
    projectTitle: null,
    projectId: null,
    handle: null,
    reason: null,
    isRunning: false
  }

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        OpenaireBrokerEventComponent,
        TestComponent,
      ],
      providers: [
        // { provide: ActivatedRoute, useValue: { data: observableOf(activatedRouteParams), paramMap: observableOf(activatedRouteParamsMap) } },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub(activatedRouteParamsMap, activatedRouteParams) },
        { provide: OpenaireBrokerEventRestService, useValue: openaireBrokerEventRestServiceStub },
        { provide: NgbModal, useValue: modalStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: TranslateService, useValue: getMockTranslateService() },
        OpenaireBrokerEventComponent
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
        <ds-openaire-broker-event></ds-openaire-broker-event>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create OpenaireBrokerEventComponent', inject([OpenaireBrokerEventComponent], (app: OpenaireBrokerEventComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(OpenaireBrokerEventComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;

    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    describe('setPage', () => {
      it('should call getOpenaireBrokerEvents', () => {
        spyOn(compAsAny, 'getOpenaireBrokerEvents');
        comp.paginationConfig = new PaginationComponentOptions();
        comp.paginationConfig.currentPage = 1;

        comp.setPage(2);
        expect(compAsAny.getOpenaireBrokerEvents).toHaveBeenCalled();
      });
    });

    describe('setEventUpdated', () => {
      it('should make a BehaviorSubject<OpenaireBrokerEventData[ ... ]>', () => {
        openAireBrokerEventData1.isRunning = false;
        openAireBrokerEventData2.isRunning = false;
        const expected$: BehaviorSubject<OpenaireBrokerEventData[]> = new BehaviorSubject([
          openAireBrokerEventData1,
          openAireBrokerEventData2
        ]);

        compAsAny.setEventUpdated(events);
        expect(comp.eventsUpdated$).toEqual(expected$);
      });
    });

    describe('modalChoice', () => {
      beforeEach(() => {
        spyOn(comp, 'executeAction');
        spyOn(comp, 'openModal');
      });

      it('should call executeAction if a project is present', () => {
        const action = 'ACCEPTED';
        comp.modalChoice(action, openAireBrokerEventData1, modalStub);
        expect(comp.executeAction).toHaveBeenCalledWith(action, openAireBrokerEventData1);
      });

      it('should call openModal if a project is not present', () => {
        const action = 'ACCEPTED';
        comp.modalChoice(action, openAireBrokerEventData2, modalStub);
        expect(comp.openModal).toHaveBeenCalledWith(action, openAireBrokerEventData2, modalStub);
      });
    });

    describe('openModal', () => {
      it('should call modalService.open', () => {
        const action = 'ACCEPTED';
        comp.selectedReason = null;
        spyOn(compAsAny.modalService, 'open').and.returnValue({ result: new Promise((res, rej) => 'do' ) });
        spyOn(comp, 'executeAction');

        comp.openModal(action, openAireBrokerEventData1, modalStub);
        expect(compAsAny.modalService.open).toHaveBeenCalled();
      });
    });

    describe('openModalLookup', () => {
      it('should call modalService.open', () => {
        spyOn(compAsAny.modalService, 'open').and.returnValue(
          {
            componentInstance: {
              externalSourceEntry: null,
              label: null,
              importedObject: observableOf(() => {
                return OpenaireMockDspaceObject;
              })
            }
          }
        );

        comp.openModalLookup(openAireBrokerEventData1);
        expect(compAsAny.modalService.open).toHaveBeenCalled();
      });
    });

    describe('executeAction', () => {
      it('should call getOpenaireBrokerEvents on 200 response from REST', () => {
        const action = 'ACCEPTED';
        spyOn(compAsAny, 'getOpenaireBrokerEvents');
        openaireBrokerEventRestServiceStub.patchEvent.and.returnValue(observableOf(new RestResponse(true, 200, 'Success')));

        comp.executeAction(action, openAireBrokerEventData1);


        expect(compAsAny.getOpenaireBrokerEvents).toHaveBeenCalled();
      });
    });

    describe('boundProject', () => {

    });

    describe('removeProject', () => {

    });

    describe('getOpenaireBrokerEvents', () => {

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
