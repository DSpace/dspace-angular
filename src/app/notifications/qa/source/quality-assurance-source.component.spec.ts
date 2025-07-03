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

import { PaginationService } from '../../../core/pagination/pagination.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import {
  getMockNotificationsStateService,
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
} from '../../../shared/mocks/notifications.mock';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { NotificationsStateService } from '../../notifications-state.service';
import {
  SourceListComponent,
  SourceObject,
} from '../../shared/source-list.component';
import { QualityAssuranceSourceComponent } from './quality-assurance-source.component';

describe('QualityAssuranceSourceComponent test suite', () => {
  let fixture: ComponentFixture<QualityAssuranceSourceComponent>;
  let comp: QualityAssuranceSourceComponent;
  let compAsAny: any;
  const mockNotificationsStateService = getMockNotificationsStateService();
  const activatedRouteParams = {
    qualityAssuranceSourceParams: {
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
        QualityAssuranceSourceComponent,
        TestComponent,
      ],
      providers: [
        { provide: NotificationsStateService, useValue: mockNotificationsStateService },
        { provide: ActivatedRoute, useValue: { data: of(activatedRouteParams), params: of({}) } },
        { provide: PaginationService, useValue: paginationService },
        QualityAssuranceSourceComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(QualityAssuranceSourceComponent, {
        remove: {
          imports: [
            AlertComponent,
            SourceListComponent,
          ],
        },
      })
      .compileComponents().then(() => {
        mockNotificationsStateService.getQualityAssuranceSource.and.returnValue(of([
          qualityAssuranceSourceObjectMorePid,
          qualityAssuranceSourceObjectMoreAbstract,
        ]));
        mockNotificationsStateService.getQualityAssuranceSourceTotalPages.and.returnValue(of(1));
        mockNotificationsStateService.getQualityAssuranceSourceCurrentPage.and.returnValue(of(0));
        mockNotificationsStateService.getQualityAssuranceSourceTotals.and.returnValue(of(2));
        mockNotificationsStateService.isQualityAssuranceSourceLoaded.and.returnValue(of(true));
        mockNotificationsStateService.isQualityAssuranceSourceLoading.and.returnValue(of(false));
        mockNotificationsStateService.isQualityAssuranceSourceProcessing.and.returnValue(of(false));
      });
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-quality-assurance-source></ds-quality-assurance-source>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create QualityAssuranceSourceComponent', inject([QualityAssuranceSourceComponent], (app: QualityAssuranceSourceComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests running with two Source', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(QualityAssuranceSourceComponent);
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
      const expected: SourceObject[] = [
        { id: qualityAssuranceSourceObjectMorePid.id,
          lastEvent: qualityAssuranceSourceObjectMorePid.lastEvent,
          total: qualityAssuranceSourceObjectMorePid.totalEvents,
        },
        { id: qualityAssuranceSourceObjectMoreAbstract.id,
          lastEvent: qualityAssuranceSourceObjectMoreAbstract.lastEvent,
          total: qualityAssuranceSourceObjectMoreAbstract.totalEvents,
        },
      ];

      expect(comp.sources$).toBeObservable(cold('(a|)', {
        a: expected,
      }));
      expect(comp.totalElements$).toBeObservable(cold('(a|)', {
        a: 2,
      }));
    });

    it(('Should set data properly after the view init'), () => {
      spyOn(compAsAny, 'getQualityAssuranceSource');

      comp.ngAfterViewInit();
      fixture.detectChanges();

      expect(compAsAny.getQualityAssuranceSource).toHaveBeenCalled();
    });

    it(('isSourceLoading should return FALSE'), () => {
      expect(comp.isSourceLoading()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

    it(('isSourceProcessing should return FALSE'), () => {
      expect(comp.isSourceProcessing()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

    it(('getQualityAssuranceSource should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.notificationsStateService.dispatchRetrieveQualityAssuranceSource(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.notificationsStateService.dispatchRetrieveQualityAssuranceSource).toHaveBeenCalledWith(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage);
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
