// ... test imports
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement
} from "@angular/core";
import { By } from '@angular/platform-browser';
import { TranslateModule } from "ng2-translate";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from "@ngrx/store";


// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { CommonModule } from '@angular/common';

let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de:      DebugElement;
let el:      HTMLElement;


describe('App component', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [ CommonModule, TranslateModule.forRoot(), NgbCollapseModule.forRoot()],
      declarations: [ AppComponent, HeaderComponent ], // declare the test component
      providers: [
        AppComponent,
        {
          provide: Store,
          useClass: class { dispatch = jasmine.createSpy('dispatch') }
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    // query for the title <p> by CSS element selector
    de = fixture.debugElement.query(By.css('p'));
    el = de.nativeElement;
  });

  it('should create component', inject([AppComponent], (app: AppComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));
});
