import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from "./header.component";
import { Store, StoreModule } from "@ngrx/store";
import { HeaderState } from "./header.reducer";
import Spy = jasmine.Spy;
import { HeaderToggleAction } from "./header.actions";
import { TranslateModule } from "ng2-translate";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

let comp: HeaderComponent;
let fixture: ComponentFixture<HeaderComponent>;
let store: Store<HeaderState>;

describe('HeaderComponent', () => {

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.provideStore({}), TranslateModule.forRoot(), NgbCollapseModule.forRoot() ],
      declarations: [ HeaderComponent ]
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
      let navbarToggler = fixture.debugElement.query(By.css('.navbar-toggler'));
      navbarToggler.triggerEventHandler('click', null);
    });

    it("should dispatch a HeaderToggleAction", () => {
      expect(store.dispatch).toHaveBeenCalledWith(new HeaderToggleAction());
    });

  });

  describe("when navCollapsed in the store is true", () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#collapsingNav')).nativeElement;
      spyOn(store, 'select').and.returnValue(Observable.of({ navCollapsed: true }));
      fixture.detectChanges();
    });

    it("should close the menu", () => {
      expect(menu.classList).not.toContain('in');
    });

  });

  describe("when navCollapsed in the store is false", () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#collapsingNav')).nativeElement;
      spyOn(store, 'select').and.returnValue(Observable.of({ navCollapsed: false }));
      fixture.detectChanges();
    });

    it("should open the menu", () => {
      expect(menu.classList).toContain('in');
    });

  });

});
