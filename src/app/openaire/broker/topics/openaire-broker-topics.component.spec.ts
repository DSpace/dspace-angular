import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { createTestComponent } from '../../../shared/testing/utils.test';
import {
  getMockOpenaireStateService,
  openaireBrokerTopicObjectMoreAbstract,
  openaireBrokerTopicObjectMorePid
} from '../../../shared/mocks/openaire.mock';
import { OpenaireBrokerTopicsComponent } from './openaire-broker-topics.component';
import { OpenaireStateService } from '../../openaire-state.service';
import { cold } from 'jasmine-marbles';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { PaginationService } from '../../../core/pagination/pagination.service';

describe('OpenaireBrokerTopicsComponent test suite', () => {
  let fixture: ComponentFixture<OpenaireBrokerTopicsComponent>;
  let comp: OpenaireBrokerTopicsComponent;
  let compAsAny: any;
  const mockOpenaireStateService = getMockOpenaireStateService();
  const activatedRouteParams = {
    openaireBrokerTopicsParams: {
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
        OpenaireBrokerTopicsComponent,
        TestComponent,
      ],
      providers: [
        { provide: OpenaireStateService, useValue: mockOpenaireStateService },
        { provide: ActivatedRoute, useValue: { data: observableOf(activatedRouteParams), params: observableOf({}) } },
        { provide: PaginationService, useValue: paginationService },
        OpenaireBrokerTopicsComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      mockOpenaireStateService.getOpenaireBrokerTopics.and.returnValue(observableOf([
        openaireBrokerTopicObjectMorePid,
        openaireBrokerTopicObjectMoreAbstract
      ]));
      mockOpenaireStateService.getOpenaireBrokerTopicsTotalPages.and.returnValue(observableOf(1));
      mockOpenaireStateService.getOpenaireBrokerTopicsCurrentPage.and.returnValue(observableOf(0));
      mockOpenaireStateService.getOpenaireBrokerTopicsTotals.and.returnValue(observableOf(2));
      mockOpenaireStateService.isOpenaireBrokerTopicsLoaded.and.returnValue(observableOf(true));
      mockOpenaireStateService.isOpenaireBrokerTopicsLoading.and.returnValue(observableOf(false));
      mockOpenaireStateService.isOpenaireBrokerTopicsProcessing.and.returnValue(observableOf(false));
    });
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-openaire-broker-topic></ds-openaire-broker-topic>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create OpenaireBrokerTopicsComponent', inject([OpenaireBrokerTopicsComponent], (app: OpenaireBrokerTopicsComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('Main tests running with two topics', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(OpenaireBrokerTopicsComponent);
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
          openaireBrokerTopicObjectMorePid,
          openaireBrokerTopicObjectMoreAbstract
        ]
      }));
      expect(comp.totalElements$).toBeObservable(cold('(a|)', {
        a: 2
      }));
    });

    it(('Should set data properly after the view init'), () => {
      spyOn(compAsAny, 'getOpenaireBrokerTopics');

      comp.ngAfterViewInit();
      fixture.detectChanges();

      expect(compAsAny.getOpenaireBrokerTopics).toHaveBeenCalled();
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

    it(('getOpenaireBrokerTopics should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.openaireStateService.dispatchRetrieveOpenaireBrokerTopics(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.openaireStateService.dispatchRetrieveOpenaireBrokerTopics).toHaveBeenCalledWith(comp.paginationConfig.pageSize, comp.paginationConfig.currentPage);
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
