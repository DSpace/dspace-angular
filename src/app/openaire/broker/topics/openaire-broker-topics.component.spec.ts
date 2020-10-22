import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { createTestComponent } from '../../../shared/testing/utils.test';
import {
  getMockOpenaireStateService,
  openaireBrokerTopicObjectMoreAbstract,
  openaireBrokerTopicObjectMorePid
} from '../../../shared/mocks/openaire.mock';
import { OpenaireBrokerTopicsComponent } from './openaire-broker-topics.component';
import { OpenaireStateService } from '../../openaire-state.service';
import { cold } from 'jasmine-marbles';

describe('OpenaireBrokerTopicsComponent test suite', () => {
  let fixture: ComponentFixture<OpenaireBrokerTopicsComponent>;
  let comp: OpenaireBrokerTopicsComponent;
  let compAsAny: any;
  const activatedRouteParams = {
    openaireBrokerTopicsParams: {
      currentPage: 0,
      pageSize: 5
    }
  };

  beforeEach(async (() => {
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
        { provide: OpenaireStateService, useClass: getMockOpenaireStateService },
        { provide: ActivatedRoute, useValue: { data: observableOf(activatedRouteParams), params: observableOf({}) } },
        OpenaireBrokerTopicsComponent
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
      compAsAny.openaireStateService.getOpenaireBrokerTopics.and.returnValue(observableOf([
        openaireBrokerTopicObjectMorePid,
        openaireBrokerTopicObjectMoreAbstract
      ]));
      compAsAny.openaireStateService.getOpenaireBrokerTopicsTotalPages.and.returnValue(observableOf(1));
      compAsAny.openaireStateService.getOpenaireBrokerTopicsCurrentPage.and.returnValue(observableOf(0));
      compAsAny.openaireStateService.getOpenaireBrokerTopicsTotals.and.returnValue(observableOf(2));
      compAsAny.openaireStateService.isOpenaireBrokerTopicsLoaded.and.returnValue(observableOf(true));
      compAsAny.openaireStateService.isOpenaireBrokerTopicsLoading.and.returnValue(observableOf(false));
      compAsAny.openaireStateService.isOpenaireBrokerTopicsProcessing.and.returnValue(observableOf(false));
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

    it(('setPage should set the currentPage and call getOpenaireBrokerTopics'), () => {
      spyOn(compAsAny, 'getOpenaireBrokerTopics');

      comp.ngOnInit();
      fixture.detectChanges();

      comp.setPage(2);
      expect(comp.paginationConfig.currentPage).toEqual(2);
      expect(compAsAny.getOpenaireBrokerTopics).toHaveBeenCalled();
    });

    it(('getOpenaireBrokerTopics should call the service to dispatch a STATE change'), () => {
      comp.ngOnInit();
      fixture.detectChanges();

      compAsAny.openaireStateService.dispatchRetrieveOpenaireBrokerTopics(comp.elementsPerPage, comp.paginationConfig.currentPage).and.callThrough();
      expect(compAsAny.openaireStateService.dispatchRetrieveOpenaireBrokerTopics).toHaveBeenCalledWith(comp.elementsPerPage, comp.paginationConfig.currentPage);
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
