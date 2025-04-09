import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { TabDataService } from '../core/layout/tab-data.service';
import { Item } from '../core/shared/item.model';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import {
  bothTabs,
  leadingTabs,
  loaderTabs,
} from '../shared/testing/layout-tab.mocks';
import { createPaginatedList } from '../shared/testing/utils.test';
import { CrisLayoutComponent } from './cris-layout.component';
import { CrisLayoutLeadingComponent } from './cris-layout-leading/cris-layout-leading.component';
import { CrisLayoutLoaderComponent } from './cris-layout-loader/cris-layout-loader.component';

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'test',
      },
    ],
    'dspace.entity.type': [
      {
        language: null,
        value: 'Person',
      },
    ],
  },
});

const tabDataServiceMock: any = jasmine.createSpyObj('TabDataService', {
  findByItem: observableOf(leadingTabs),
});
const route = {
  data: observableOf({ tabs: createSuccessfulRemoteDataObject(createPaginatedList(leadingTabs)) }),
};

describe('CrisLayoutComponent', () => {
  let component: CrisLayoutComponent;
  let fixture: ComponentFixture<CrisLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, CrisLayoutComponent],
      providers: [
        { provide: TabDataService, useValue: tabDataServiceMock },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CrisLayoutComponent, { remove: { imports: [CrisLayoutLeadingComponent, CrisLayoutLoaderComponent] } }).compileComponents();
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

    it('it should show only ds-cris-layout-leading when only leading tabs', fakeAsync(() => {
      component.tabs$ = observableOf(leadingTabs);
      component.leadingTabs$ = observableOf(leadingTabs);
      component.loaderTabs$ = observableOf([]);
      fixture.detectChanges();
      tick(); // Simulate the passage of time to ensure the DOM is updated
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeNull();
    }));

    it('it should show only ds-cris-layout-loader when only loader tabs', fakeAsync(() => {
      component.tabs$ = observableOf(loaderTabs);
      component.leadingTabs$ = observableOf([]);
      component.loaderTabs$ = observableOf(loaderTabs);
      fixture.detectChanges();
      tick(); // Simulate the passage of time to ensure the DOM is updated
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeNull();
    }));

    it('it should show both when both types of tabs', fakeAsync(() => {
      component.tabs$ = observableOf(bothTabs);
      component.leadingTabs$ = observableOf(leadingTabs);
      component.loaderTabs$ = observableOf(loaderTabs);
      fixture.detectChanges();
      tick(); // Simulate the passage of time to ensure the DOM is updated
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-loader'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('ds-cris-layout-leading'))).toBeTruthy();
    }));

  });

});
