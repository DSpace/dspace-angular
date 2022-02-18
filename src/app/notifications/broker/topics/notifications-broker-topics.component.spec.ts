import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { createTestComponent } from '../../../shared/testing/utils.test';
import {
  getMockNotificationsStateService,
  notificationsBrokerTopicObjectMoreAbstract,
  notificationsBrokerTopicObjectMorePid
} from '../../../shared/mocks/notifications.mock';
import { NotificationsBrokerTopicsComponent } from './notifications-broker-topics.component';
import { NotificationsStateService } from '../../notifications-state.service';
import { cold } from 'jasmine-marbles';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { PaginationService } from '../../../core/pagination/pagination.service';

describe('NotificationsBrokerTopicsComponent test suite', () => {
  let fixture: ComponentFixture<NotificationsBrokerTopicsComponent>;
  let comp: NotificationsBrokerTopicsComponent;
  let compAsAny: any;
  const mockNotificationsStateService = getMockNotificationsStateService();
  const activatedRouteParams = {
    notificationsBrokerTopicsParams: {
      currentPage: 0,
      pageSize: 5
    }
  };
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        NotificationsBrokerTopicsComponent,
        TestComponent,
      ],
      providers: [
        { provide: NotificationsStateService, useValue: mockNotificationsStateService },
        { provide: ActivatedRoute, useValue: { data: observableOf(activatedRouteParams), params: observableOf({}) } },
        { provide: PaginationService, useValue: paginationService },
        NotificationsBrokerTopicsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      mockNotificationsStateService.getNotificationsBrokerTopics.and.returnValue(observableOf([
        notificationsBrokerTopicObjectMorePid,
        notificationsBrokerTopicObjectMoreAbstract
      ]));
      mockNotificationsStateService.getNotificationsBrokerTopicsTotalPages.and.returnValue(observableOf(1));
      mockNotificationsStateService.getNotificationsBrokerTopicsCurrentPage.and.returnValue(observableOf(0));
      mockNotificationsStateService.getNotificationsBrokerTopicsTotals.and.returnValue(observableOf(2));
      mockNotificationsStateService.isNotificationsBrokerTopicsLoaded.and.returnValue(observableOf(true));
      mockNotificationsStateService.isNotificationsBrokerTopicsLoading.and.returnValue(observableOf(false));
      mockNotificationsStateService.isNotificationsBrokerTopicsProcessing.and.returnValue(observableOf(false));
    });
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-notifications-broker-topic></ds-notifications-broker-topic>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create NotificationsBrokerTopicsComponent', inject([NotificationsBrokerTopicsComponent], (app: NotificationsBrokerTopicsComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests running with two topics', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(NotificationsBrokerTopicsComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;

    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it(('Should init component properly'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      expect(comp.topics$).toBeObservable(cold('(a|)', {
        a: [
          notificationsBrokerTopicObjectMorePid,
          notificationsBrokerTopicObjectMoreAbstract
        ]
      }));
      expect(comp.totalElements$).toBeObservable(cold('(a|)', {
        a: 2
      }));
    });

    it(('Should set data properly after the view init'), () => {
      spyOn(compAsAny, 'getNotificationsBrokerTopics');

      comp.ngAfterViewInit();
      fixture.detectChanges();

      expect(compAsAny.getNotificationsBrokerTopics).toHaveBeenCalled();
    });

    it(('isTopicsLoading should return FALSE'), () => {
      expect(comp.isTopicsLoading()).toBeObservable(cold('(a|)', {
        a: false
      }));
    });

    it(('isTopicsProcessing should return FALSE'), () => {
      expect(comp.isTopicsProcessing()).toBeObservable(cold('(a|)', {
        a: false
      }));
    });

    it(('getNotificationsBrokerTopics should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.notificationsStateService.dispatchRetrieveNotificationsBrokerTopics(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.notificationsStateService.dispatchRetrieveNotificationsBrokerTopics).toHaveBeenCalledWith(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage);
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
