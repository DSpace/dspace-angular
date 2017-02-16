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
import { TranslateModule, TranslateLoader } from "ng2-translate";
import { Store, StoreModule } from "@ngrx/store";

// Load the implementations that should be tested
import { FooterComponent } from './footer.component';

import { CommonModule } from '@angular/common';
import { MockTranslateLoader } from "../../shared/testing/mock-translate-loader";

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let de: DebugElement;
let el: HTMLElement;

describe('Footer component', () => {

  // async beforeEach
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.provideStore({}), TranslateModule.forRoot({
        provide: TranslateLoader,
        useClass: MockTranslateLoader
      })],
      declarations: [FooterComponent], // declare the test component
      providers: [
        FooterComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);

    comp = fixture.componentInstance; // component test instance

    // query for the title <p> by CSS element selector
    de = fixture.debugElement.query(By.css('p'));
    el = de.nativeElement;
  });

  it('should create footer', inject([FooterComponent], (app: FooterComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

});
