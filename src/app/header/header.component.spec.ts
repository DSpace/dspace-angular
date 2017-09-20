import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';
import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';

import Spy = jasmine.Spy;

let comp: HeaderComponent;
let fixture: ComponentFixture<HeaderComponent>;
let store: Store<HeaderState>;

describe('HeaderComponent', () => {

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), TranslateModule.forRoot(), NgbCollapseModule.forRoot()],
      declarations: [HeaderComponent]
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
