/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
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
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { ItemDataService } from 'src/app/core/data/item-data.service';

import { PaginationService } from '../../../core/pagination/pagination.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import {
  getMockNotificationsStateService,
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid,
} from '../../../shared/mocks/notifications.mock';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { NotificationsStateService } from '../../notifications-state.service';
import { QualityAssuranceTopicsComponent } from './quality-assurance-topics.component';

describe('QualityAssuranceTopicsComponent test suite', () => {
  let fixture: ComponentFixture<QualityAssuranceTopicsComponent>;
  let comp: QualityAssuranceTopicsComponent;
  let compAsAny: any;
  const mockNotificationsStateService = getMockNotificationsStateService();
  const activatedRouteParams = {
    qualityAssuranceTopicsParams: {
      currentPage: 0,
      pageSize: 5,
    },
  };
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        QualityAssuranceTopicsComponent,
        TestComponent,
      ],
      providers: [
        { provide: NotificationsStateService, useValue: mockNotificationsStateService },
        { provide: ActivatedRoute, useValue: { data: of(activatedRouteParams), snapshot: {
          params: {
            sourceId: 'openaire',
            targetId: null,
          },
        } } },
        { provide: PaginationService, useValue: paginationService },
        { provide: ItemDataService, useValue: {} },
        QualityAssuranceTopicsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(QualityAssuranceTopicsComponent, {
        remove: {
          imports: [
            AlertComponent,
            ThemedLoadingComponent,
            PaginationComponent,
          ],
        },
      })
      .compileComponents().then(() => {
        mockNotificationsStateService.getQualityAssuranceTopics.and.returnValue(of([
          qualityAssuranceTopicObjectMorePid,
          qualityAssuranceTopicObjectMoreAbstract,
        ]));
        mockNotificationsStateService.getQualityAssuranceTopicsTotalPages.and.returnValue(of(1));
        mockNotificationsStateService.getQualityAssuranceTopicsCurrentPage.and.returnValue(of(0));
        mockNotificationsStateService.getQualityAssuranceTopicsTotals.and.returnValue(of(2));
        mockNotificationsStateService.isQualityAssuranceTopicsLoaded.and.returnValue(of(true));
        mockNotificationsStateService.isQualityAssuranceTopicsLoading.and.returnValue(of(false));
        mockNotificationsStateService.isQualityAssuranceTopicsProcessing.and.returnValue(of(false));
      });
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-quality-assurance-topic></ds-quality-assurance-topic>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create QualityAssuranceTopicsComponent', inject([QualityAssuranceTopicsComponent], (app: QualityAssuranceTopicsComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests running with two topics', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(QualityAssuranceTopicsComponent);
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
          qualityAssuranceTopicObjectMorePid,
          qualityAssuranceTopicObjectMoreAbstract,
        ],
      }));
      expect(comp.totalElements$).toBeObservable(cold('(a|)', {
        a: 2,
      }));
    });

    it(('Should set data properly after the view init'), () => {
      spyOn(compAsAny, 'getQualityAssuranceTopics');

      comp.ngAfterViewInit();
      fixture.detectChanges();

      expect(compAsAny.getQualityAssuranceTopics).toHaveBeenCalled();
    });

    it(('isTopicsLoading should return FALSE'), () => {
      expect(comp.isTopicsLoading()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

    it(('isTopicsProcessing should return FALSE'), () => {
      expect(comp.isTopicsProcessing()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

    it(('getQualityAssuranceTopics should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.notificationsStateService.dispatchRetrieveQualityAssuranceTopics(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.notificationsStateService.dispatchRetrieveQualityAssuranceTopics).toHaveBeenCalledWith(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage);
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [],
})
class TestComponent {

}
