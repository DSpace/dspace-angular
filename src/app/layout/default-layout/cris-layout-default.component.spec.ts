import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutDefaultComponent } from './cris-layout-default.component';
import { LayoutPage } from '../enums/layout-page.enum';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { Tab } from 'src/app/core/layout/models/tab.model';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { tabs, tabPersonTest } from 'src/app/shared/testing/tab.mock';
import { ComponentFactoryResolver, ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TabDataService } from 'src/app/core/layout/tab-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrisLayoutDefaultTabComponent } from './tab/cris-layout-default-tab.component';
import * as CrisLayoutTabDecorators from '../decorators/cris-layout-tab.decorator';
import { Item } from 'src/app/core/shared/item.model';
import { spyOnExported } from 'src/app/shared/testing/utils.test';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { Box } from 'src/app/core/layout/models/box.model';
import { BoxDataService } from 'src/app/core/layout/box-data.service';

const testType = LayoutPage.DEFAULT;
class TestItem {
  firstMetadataValue(key: string): string {
    return testType;
  }
}
// tslint:disable-next-line: max-classes-per-file
class TabDataServiceMock {
  findByItem(itemUuid: string, linkToFollow?: FollowLinkConfig<Tab>): Observable<RemoteData<PaginatedList<Tab>>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), tabs)
        )
    });
  }
}
// tslint:disable-next-line: max-classes-per-file
class BoxDataServiceMock {
  findByItem(itemUuid: string, tabId: number): Observable<RemoteData<PaginatedList<Box>>> {
    return cold('a|', {
      a: {}
    });
  }
}

describe('CrisLayoutDefaultComponent', () => {
  let component: CrisLayoutDefaultComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ CrisLayoutDefaultComponent, CrisLayoutDefaultTabComponent, CrisLayoutLoaderDirective ],
      providers: [
        ComponentFactoryResolver,
        {provide: TabDataService, useClass: TabDataServiceMock},
        {provide: BoxDataService, useClass: BoxDataServiceMock},
        {provide: Router, useValue: {}},
        {provide: ActivatedRoute, useValue: {}},
        {provide: ComponentFactoryResolver, useValue: {}},
        {provide: ChangeDetectorRef, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisLayoutDefaultComponent, {
      set: {
        entryComponents: [CrisLayoutDefaultTabComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutDefaultComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    spyOnExported(CrisLayoutTabDecorators, 'getCrisLayoutTab').and.returnValue(CrisLayoutDefaultTabComponent);
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getCrisLayoutPage function with the right types', () => {
      component.changeTab(tabPersonTest);
      expect(CrisLayoutTabDecorators.getCrisLayoutTab).toHaveBeenCalledWith(new TestItem() as Item, tabPersonTest.shortname);
    })

    it('check sidebar hide/show function', () => {
      expect(component.sidebarStatus).toBeFalse();
      component.hideShowSidebar();
      expect(component.sidebarStatus).toBeTrue();
      component.hideShowSidebar();
    });

  });
});
