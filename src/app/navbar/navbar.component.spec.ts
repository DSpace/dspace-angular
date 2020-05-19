import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;

describe('NavbarComponent', () => {
  const menuService = new MenuServiceStub();

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: ActivatedRoute, useValue: {} }
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
