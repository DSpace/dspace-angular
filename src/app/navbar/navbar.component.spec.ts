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
import { Item } from '../core/shared/item.model';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { By } from '@angular/platform-browser';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;

const authorizationService = jasmine.createSpyObj('authorizationService', {
  isAuthorized: observableOf(true)
});

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  uuid: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  _links: {
    self: {
      href: 'https://localhost:8000/items/fake-id'
    }
  }
});

const routeStub = {
  data: observableOf({
    dso: createSuccessfulRemoteDataObject(mockItem)
  }),
  children: []
};



describe('NavbarComponent', () => {
  const menuService = new MenuServiceStub();

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
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
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {

    fixture = TestBed.createComponent(NavbarComponent);

    comp = fixture.componentInstance;

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });


});
