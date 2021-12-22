import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { of as observableOf } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuService } from '../shared/menu/menu.service';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowseService } from '../core/browse/browse.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { buildPaginatedList } from '../core/data/paginated-list.model';
import { BrowseDefinition } from '../core/shared/browse-definition.model';
import { BrowseByDataType } from '../browse-by/browse-by-switcher/browse-by-decorator';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;

describe('NavbarComponent', () => {
  const menuService = new MenuServiceStub();
  let browseDefinitions;
  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    browseDefinitions = [
      Object.assign(
        new BrowseDefinition(), {
          id: 'title',
          dataType: BrowseByDataType.Title,
        }
      ),
      Object.assign(
        new BrowseDefinition(), {
          id: 'dateissued',
          dataType: BrowseByDataType.Date,
          metadataKeys: ['dc.date.issued']
        }
      ),
      Object.assign(
        new BrowseDefinition(), {
          id: 'author',
          dataType: BrowseByDataType.Metadata,
        }
      ),
      Object.assign(
        new BrowseDefinition(), {
          id: 'subject',
          dataType: BrowseByDataType.Metadata,
        }
      ),
    ];

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        Injector,
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: ActivatedRoute, useValue: {} },
        { provide: BrowseService, useValue: { getBrowseDefinitions: createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, browseDefinitions)) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    spyOn(menuService, 'getMenuTopSections').and.returnValue(observableOf([]));

    fixture = TestBed.createComponent(NavbarComponent);

    comp = fixture.componentInstance;

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
