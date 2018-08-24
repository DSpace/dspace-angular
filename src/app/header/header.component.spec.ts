import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { HeaderComponent } from './header.component';
import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';
import { AuthNavMenuComponent } from '../shared/auth-nav-menu/auth-nav-menu.component';
import { LogInComponent } from '../shared/log-in/log-in.component';
import { LogOutComponent } from '../shared/log-out/log-out.component';
import { LoadingComponent } from '../shared/loading/loading.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service-stub';
import { RouterStub } from '../shared/testing/router-stub';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

let comp: HeaderComponent;
let fixture: ComponentFixture<HeaderComponent>;
let store: Store<HeaderState>;

describe('HeaderComponent', () => {

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule],
      declarations: [HeaderComponent, AuthNavMenuComponent, LoadingComponent, LogInComponent, LogOutComponent],
      providers: [
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: Router, useClass: RouterStub },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);

    comp = fixture.componentInstance;

    store = fixture.debugElement.injector.get(Store);
    spyOn(store, 'dispatch');
  });

  describe('when the toggle button is clicked', () => {

    beforeEach(() => {
      const navbarToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
      navbarToggler.triggerEventHandler('click', null);
    });

    it('should dispatch a HeaderToggleAction', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new HeaderToggleAction());
    });

  });

  describe('when navCollapsed in the store is true', () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#collapsingNav')).nativeElement;
      spyOn(store, 'select').and.returnValue(Observable.of({ navCollapsed: true }));
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
      spyOn(store, 'select').and.returnValue(Observable.of(false));
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('show');
    });

  });

});
