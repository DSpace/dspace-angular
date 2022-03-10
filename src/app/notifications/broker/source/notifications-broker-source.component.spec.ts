import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { createTestComponent } from '../../../shared/testing/utils.test';
import {
  getMockNotificationsStateService,
  notificationsBrokerSourceObjectMoreAbstract,
  notificationsBrokerSourceObjectMorePid
} from '../../../shared/mocks/notifications.mock';
import { NotificationsBrokerSourceComponent } from './notifications-broker-source.component';
import { NotificationsStateService } from '../../notifications-state.service';
import { cold } from 'jasmine-marbles';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { PaginationService } from '../../../core/pagination/pagination.service';

describe('NotificationsBrokerSourceComponent test suite', () => {
  let fixture: ComponentFixture<NotificationsBrokerSourceComponent>;
  let comp: NotificationsBrokerSourceComponent;
  let compAsAny: any;
  const mockNotificationsStateService = getMockNotificationsStateService();
  const activatedRouteParams = {
    notificationsBrokerSourceParams: {
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
        NotificationsBrokerSourceComponent,
        TestComponent,
      ],
      providers: [
        { provide: NotificationsStateService, useValue: mockNotificationsStateService },
        { provide: ActivatedRoute, useValue: { data: observableOf(activatedRouteParams), params: observableOf({}) } },
        { provide: PaginationService, useValue: paginationService },
        NotificationsBrokerSourceComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      mockNotificationsStateService.getNotificationsBrokerSource.and.returnValue(observableOf([
        notificationsBrokerSourceObjectMorePid,
        notificationsBrokerSourceObjectMoreAbstract
      ]));
      mockNotificationsStateService.getNotificationsBrokerSourceTotalPages.and.returnValue(observableOf(1));
      mockNotificationsStateService.getNotificationsBrokerSourceCurrentPage.and.returnValue(observableOf(0));
      mockNotificationsStateService.getNotificationsBrokerSourceTotals.and.returnValue(observableOf(2));
      mockNotificationsStateService.isNotificationsBrokerSourceLoaded.and.returnValue(observableOf(true));
      mockNotificationsStateService.isNotificationsBrokerSourceLoading.and.returnValue(observableOf(false));
      mockNotificationsStateService.isNotificationsBrokerSourceProcessing.and.returnValue(observableOf(false));
    });
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-notifications-broker-source></ds-notifications-broker-source>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create NotificationsBrokerSourceComponent', inject([NotificationsBrokerSourceComponent], (app: NotificationsBrokerSourceComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests running with two Source', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(NotificationsBrokerSourceComponent);
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

      expect(comp.sources$).toBeObservable(cold('(a|)', {
        a: [
          notificationsBrokerSourceObjectMorePid,
          notificationsBrokerSourceObjectMoreAbstract
        ]
      }));
      expect(comp.totalElements$).toBeObservable(cold('(a|)', {
        a: 2
      }));
    });

    it(('Should set data properly after the view init'), () => {
      spyOn(compAsAny, 'getNotificationsBrokerSource');

      comp.ngAfterViewInit();
      fixture.detectChanges();

      expect(compAsAny.getNotificationsBrokerSource).toHaveBeenCalled();
    });

    it(('isSourceLoading should return FALSE'), () => {
      expect(comp.isSourceLoading()).toBeObservable(cold('(a|)', {
        a: false
      }));
    });

    it(('isSourceProcessing should return FALSE'), () => {
      expect(comp.isSourceProcessing()).toBeObservable(cold('(a|)', {
        a: false
      }));
    });

    it(('getNotificationsBrokerSource should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.notificationsStateService.dispatchRetrieveNotificationsBrokerSource(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.notificationsStateService.dispatchRetrieveNotificationsBrokerSource).toHaveBeenCalledWith(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage);
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
