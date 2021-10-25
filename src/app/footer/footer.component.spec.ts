// ... test imports
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
// Load the implementations that should be tested
import { FooterComponent } from './footer.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { storeModuleConfig } from '../app.reducer';
import {of as observableOf} from 'rxjs';
import {Site} from '../core/shared/site.model';
import {SiteDataService} from '../core/data/site-data.service';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let de: DebugElement;
let el: HTMLElement;
const site: Site = Object.assign(new Site(), {
  id: 'test-site',
  _links: {
    self: { href: 'test-site-href' }
  }
});
const siteService = jasmine.createSpyObj('siteService', {
  find: observableOf(site)
});
describe('Footer component', () => {

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({}, storeModuleConfig), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [FooterComponent], // declare the test component
      providers: [
        FooterComponent,
        { provide: SiteDataService, useValue: siteService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
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
  it('should render TextSectionComponent', () => {
    comp.showTopFooter = true;
    fixture.detectChanges();
    const textComponent = fixture.debugElement.queryAll(By.css('ds-text-section'));
    expect(textComponent).toHaveSize(1);
  });
});
