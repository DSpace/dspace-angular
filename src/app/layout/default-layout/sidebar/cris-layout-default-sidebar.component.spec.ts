import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutDefaultSidebarComponent } from './cris-layout-default-sidebar.component';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Tab } from '../../../core/layout/models/tab.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { cold } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { tabs } from '../../../shared/testing/tab.mock';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { ActivatedRoute, Router } from '@angular/router';

class TabDataServiceMock {
  findByItem(itemUuid: string, linkToFollow?: FollowLinkConfig<Tab>): Observable<RemoteData<PaginatedList<Tab>>> {
    return cold('a|', {
      a: createSuccessfulRemoteDataObject(createPaginatedList(tabs))
    });
  }
}

describe('CrisLayoutDefaultSidebarComponent', () => {
  let component: CrisLayoutDefaultSidebarComponent;
  let fixture: ComponentFixture<CrisLayoutDefaultSidebarComponent>;
  const router = jasmine.createSpyObj('router', ['navigate']);
  const location = {
    path(): string {
      return '/items/a96c6d24-757a-411d-8132-bbcbbbb04210/person-biography';
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisLayoutDefaultSidebarComponent ],
      providers: [
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: router }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutDefaultSidebarComponent);
    component = fixture.componentInstance;
    component.sidebarActive = true;
    component.tabs = tabs;
    fixture.detectChanges();
    spyOn(component, 'selectTab');
  });

  it('check sidebar tabs rendering', () => {
    const navbarTabsFound = fixture.debugElement.queryAll(By.css('#sidebar ul li'));
    expect(navbarTabsFound.length).toEqual(3);
  });

  it('check if the component selects the correct tab', () => {
    const change: SimpleChanges = Object.assign({
      tabs: {
        currentValue: tabs
      }
    });
    component.ngOnChanges(change);
    expect(component.selectTab).toHaveBeenCalledWith(1);
  });
});
