import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { of as observableOf } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service-stub';
import { RouterStub } from '../shared/testing/router-stub';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as ngrx from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavbarState } from './navbar.reducer';
import { NavbarToggleAction } from './navbar.actions';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
let store: Store<NavbarState>;

describe('NavbarComponent', () => {

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);

    comp = fixture.componentInstance;

    store = fixture.debugElement.injector.get(Store) as Store<HeaderState>;
    spyOn(store, 'dispatch');
  });

  describe('when the toggle button is clicked', () => {

    beforeEach(() => {
      const navbarToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
      navbarToggler.triggerEventHandler('click', null);
    });

    it('should dispatch a NavbarToggleAction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new NavbarToggleAction());
    });

  });

  describe('when navCollapsed in the store is true', () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#collapsingNav')).nativeElement;
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf({ navCollapsed: true })
        };
      });
      fixture.detectChanges();
    });

    it('should close the menu', () => {
      expect(menu.classList).not.toContain('show');
    });

  });

  describe('when navCollapsed in the store is false', () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#collapsingNav')).nativeElement;
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf(false)
        };
      });
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('show');
    });

  });

});
