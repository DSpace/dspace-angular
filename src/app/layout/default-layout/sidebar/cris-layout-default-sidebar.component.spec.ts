import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutDefaultSidebarComponent } from './cris-layout-default-sidebar.component';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { Tab } from 'src/app/core/layout/models/tab.model';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { tabs } from 'src/app/shared/testing/tab.mock';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

class TabDataServiceMock {
  findByItem(itemUuid: string, linkToFollow?: FollowLinkConfig<Tab>): Observable<RemoteData<PaginatedList<Tab>>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), tabs)
        )
    });
  }
}

describe('CrisLayoutDefaultSidebarComponent', () => {
  let component: CrisLayoutDefaultSidebarComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisLayoutDefaultSidebarComponent ],
      providers: [ {provide: Location, useValue: {}} ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutDefaultSidebarComponent);
    component = fixture.componentInstance;
    component.tabs = tabs;
    fixture.detectChanges();
  });

  it('check sidebar tabs rendering', () => {
    const navbarTabsFound = fixture.debugElement.queryAll(By.css('#sidebar ul li'));
    expect(navbarTabsFound.length).toEqual(3);
  });
});
