import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisPageLoaderComponent } from './cris-page-loader.component';
import { CrisLayoutDefaultComponent } from './default-layout/cris-layout-default.component';
import { ChangeDetectorRef, ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { CrisLayoutLoaderDirective } from './directives/cris-layout-loader.directive';
import { LayoutPage } from './enums/layout-page.enum';
import { Item } from '../core/shared/item.model';
import { spyOnExported } from '../shared/testing/utils.test';
import * as CrisLayoutDecorators from './decorators/cris-layout-page.decorator';
import { TabDataService } from '../core/layout/tab-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { Tab } from '../core/layout/models/tab.model';
import { Observable, of } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { PageInfo } from '../core/shared/page-info.model';
import { cold } from 'jasmine-marbles';
import { tabs } from '../shared/testing/tab.mock';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditItemDataService } from '../core/submission/edititem-data.service';
import { EditItem } from '../core/submission/models/edititem.model';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthService } from '../core/auth/auth.service';

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

const editItem: EditItem = Object.assign({});

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

describe('CrisPageLoaderComponent', () => {
  let component: CrisPageLoaderComponent;
  let fixture: ComponentFixture<CrisPageLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [CrisPageLoaderComponent, CrisLayoutDefaultComponent, CrisLayoutLoaderDirective],
      providers: [
        ComponentFactoryResolver,
        { provide: TabDataService, useClass: TabDataServiceMock },
        { provide: EditItemDataService, useClass: EditItemDataServiceMock },
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ComponentFactoryResolver, useValue: {} },
        { provide: ChangeDetectorRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CrisPageLoaderComponent, {
      set: {
        entryComponents: [CrisLayoutDefaultComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisPageLoaderComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    spyOnExported(CrisLayoutDecorators, 'getCrisLayoutPage').and.returnValue(CrisLayoutDefaultComponent);
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getCrisLayoutPage function with the right types', () => {
      expect(CrisLayoutDecorators.getCrisLayoutPage).toHaveBeenCalledWith(new TestItem() as Item);
    })
  });
});
