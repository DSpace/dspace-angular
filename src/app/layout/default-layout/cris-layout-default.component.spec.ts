import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestScheduler } from 'rxjs/testing';

import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable, of as observableOf, of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CrisLayoutDefaultComponent } from './cris-layout-default.component';
import { LayoutPage } from '../enums/layout-page.enum';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Tab } from '../../core/layout/models/tab.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { PageInfo } from '../../core/shared/page-info.model';
import { tabPersonProfile, tabPersonTest, tabs } from '../../shared/testing/tab.mock';
import { TabDataService } from '../../core/layout/tab-data.service';
import { CrisLayoutDefaultTabComponent } from './tab/cris-layout-default-tab.component';
import * as CrisLayoutTabDecorators from '../decorators/cris-layout-tab.decorator';
import { Item } from '../../core/shared/item.model';
import { spyOnExported } from '../../shared/testing/utils.test';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { Box } from '../../core/layout/models/box.model';
import { BoxDataService } from '../../core/layout/box-data.service';
import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { EditItem } from '../../core/submission/models/edititem.model';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { AuthService } from "../../core/auth/auth.service";

const testType = LayoutPage.DEFAULT;
class TestItem {
  firstMetadataValue(key: string): string {
    return testType;
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

const editItem: EditItem = Object.assign({
  modes: observableOf({})
});

// tslint:disable-next-line: max-classes-per-file
class EditItemDataServiceMock {
  findById(itemUuid: string, linkToFollow?: FollowLinkConfig<EditItem>): Observable<RemoteData<EditItem>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(
        editItem
      )
    });
  }
}
// tslint:disable-next-line: max-classes-per-file
class AuthorizationDataServiceMock {
  isAuthorized(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string): Observable<boolean> {
    return of(true);
  }
}

// tslint:disable-next-line: max-classes-per-file
class AuthServiceMock {
  isAuthenticated(): Observable<boolean> {
    return of(true);
  }
}

describe('CrisLayoutDefaultComponent', () => {
  let component: CrisLayoutDefaultComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultComponent>;
  let scheduler: TestScheduler;

  describe('When the component is rendered with more then one tab', () => {
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
          {provide: EditItemDataService, useClass: EditItemDataServiceMock},
          {provide: AuthorizationDataService, useClass: AuthorizationDataServiceMock},
          {provide: AuthorizationDataService, useClass: AuthorizationDataServiceMock},
          {provide: AuthService, useClass: AuthServiceMock},
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
      scheduler = getTestScheduler();
      fixture = TestBed.createComponent(CrisLayoutDefaultComponent);
      component = fixture.componentInstance;
      component.item = new TestItem() as Item;
      spyOnExported(CrisLayoutTabDecorators, 'getCrisLayoutTab').and.returnValue(CrisLayoutDefaultTabComponent);
    });

    it('should init component properly', () => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      expect(component.getTabs()).toBeObservable(hot('-(a|)', {
        a: tabs
      }));

      expect(component.hasSidebar()).toBeObservable(hot('--(a|)', {
        a: true
      }));
    });

    it('should call the getCrisLayoutPage function with the right types', () => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      component.changeTab(tabPersonTest);
      expect(CrisLayoutTabDecorators.getCrisLayoutTab).toHaveBeenCalledWith(new TestItem() as Item, tabPersonTest.shortname);
    });

    it('check sidebar hide/show function', async(() => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      expect((component as any).sidebarStatus$.value).toBeTrue();
      component.toggleSidebar();
      expect((component as any).sidebarStatus$.value).toBeFalse();
      component.toggleSidebar();
    }));

    it('check if sidebar and its control are showed', () => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      const sidebarControl$ = component.isSideBarHidden();
      expect(sidebarControl$).toBeObservable(hot('-a', {
        a: false
      }));
    });
  });

  describe('When the component is rendered with only one tab', () => {
    // tslint:disable-next-line: max-classes-per-file
    class TabDataServiceMock {
      findByItem(itemUuid: string, linkToFollow?: FollowLinkConfig<Tab>): Observable<RemoteData<PaginatedList<Tab>>> {
        return cold('a|', {
          a: createSuccessfulRemoteDataObject(
              new PaginatedList(new PageInfo(), [tabPersonProfile])
            )
        });
      }
    }

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
          {provide: EditItemDataService, useClass: EditItemDataServiceMock},
          {provide: AuthorizationDataService, useClass: AuthorizationDataServiceMock},
          {provide: AuthorizationDataService, useClass: AuthorizationDataServiceMock},
          {provide: AuthService, useClass: AuthServiceMock},
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
      scheduler = getTestScheduler();
      fixture = TestBed.createComponent(CrisLayoutDefaultComponent);
      component = fixture.componentInstance;
      component.item = new TestItem() as Item;
      (component as any).tabs$ = observableOf([tabPersonProfile]);
      spyOnExported(CrisLayoutTabDecorators, 'getCrisLayoutTab').and.returnValue(CrisLayoutDefaultTabComponent);
    });

    it('check if sidebar and its control are hidden', () => {
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();
      const sidebarControl$ = component.isSideBarHidden();
      expect(sidebarControl$).toBeObservable(hot('-a', {
        a: true
      }));

      expect(component.hasSidebar()).toBeObservable(hot('--(a|)', {
        a: false
      }));

    });
  });

});
