/**
 * Created by Giuseppe on 21/12/2016.
 */
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
import { TranslateModule } from "ng2-translate";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from "@ngrx/store";


// Load the implementations that should be tested
import { AppComponent } from '../app/app.component';
import { HeaderComponent } from '../app/header/header.component';

import { CommonModule } from '@angular/common';

let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de:      DebugElement;
let el:      HTMLElement;


describe('greeting component', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
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
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });
  });

  it('should create component', inject([AppComponent], (app: AppComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));
});
