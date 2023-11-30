import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { SharedModule } from '../shared/shared.module';

import { CrisLayoutComponent } from './cris-layout.component';
import { Item } from '../core/shared/item.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { bothTabs, leadingTabs, loaderTabs } from '../shared/testing/layout-tab.mocks';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { ActivatedRoute } from '@angular/router';
import { createPaginatedList } from '../shared/testing/utils.test';

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'test'
      }
    ],
    'dspace.entity.type': [
      {
        language: null,
        value: 'Person'
      }
    ]
  }
});

const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
  findByItem: observableOf(leadingTabs)
});
const route = {
  data: observableOf({ tabs: createSuccessfulRemoteDataObject(createPaginatedList(leadingTabs)) })
};

describe('CrisLayoutComponent', () => {
  let component: CrisLayoutComponent;
  let fixture: ComponentFixture<CrisLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule, SharedModule],
      declarations: [CrisLayoutComponent],
      providers: [
        { provide: TabDataService, useValue: tabDataServiceMock },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    tabDataServiceMock.findByItem.and.returnValue(observableOf(leadingTabs));

    component.tabs$ = observableOf(leadingTabs);
    component.leadingTabs$ = observableOf(leadingTabs);
    component.loaderTabs$ = observableOf([]);

    component.hasLeadingTab$.next(true);
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {

    it('CrisLayoutComponent should initialize', () => {
      expect(component).toBeDefined();
    });

    xit('getTabsByItem to have been called', () => {

      const spyOnGetTabsByItem = spyOn(component, 'getTabsByItem');

      spyOnGetTabsByItem.and.returnValue(observableOf(leadingTabs));
      component.ngOnInit();
      fixture.detectChanges();

      expect(spyOnGetTabsByItem).toHaveBeenCalled();
    });

    it('getLeadingTabs to have been called', () => {

      const spyOnGetLeadingTabs = spyOn(component, 'getLeadingTabs');

      spyOnGetLeadingTabs.and.returnValue(observableOf(leadingTabs));
      component.ngOnInit();
      fixture.detectChanges();

      expect(spyOnGetLeadingTabs).toHaveBeenCalled();
    });

    it('getLoaderTabs to have been called', () => {

      const spyOnGetLoaderTabs = spyOn(component, 'getLoaderTabs');

      component.ngOnInit();
      fixture.detectChanges();

      expect(spyOnGetLoaderTabs).toHaveBeenCalled();
    });


    it('it should show only ds-cris-layout-leading when only leading tabs', () => {

      component.tabs$ = observableOf(leadingTabs);
      component.leadingTabs$ = observableOf(leadingTabs);
      component.loaderTabs$ = observableOf([]);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeNull();

    });

    it('it should show only ds-cris-layout-loader when only loader tabs', () => {

      component.tabs$ = observableOf(loaderTabs);
      component.leadingTabs$ = observableOf([]);
      component.loaderTabs$ = observableOf(loaderTabs);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeNull();

    });


    it('it should show both when both types of tabs', () => {

      component.tabs$ = observableOf(bothTabs);
      component.leadingTabs$ = observableOf(leadingTabs);
      component.loaderTabs$ = observableOf(loaderTabs);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeTruthy();

    });

  });

});
