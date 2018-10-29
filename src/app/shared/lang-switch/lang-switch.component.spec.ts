import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {LangSwitchComponent} from "./lang-switch.component";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppComponent} from "../../app.component";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

describe('LangSwitchComponent', () => {
  let component: LangSwitchComponent;
  let fixture: ComponentFixture<LangSwitchComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const TRANSLATIONS_EN = require('../../../../resources/i18n/en.json');
  const TRANSLATIONS_DE = require('../../../../resources/i18n/de.json');

  let translate: TranslateService;
  let http: HttpTestingController;

  //In the ngx-translate example, this was imported from the main app module.
  //Not sure if we really need it in the same way here.
  function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
      declarations: [LangSwitchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(LangSwitchComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should allow switching between English and German', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('en');

    // the DOM should be empty for now since the translations haven't been rendered yet
    expect(el.querySelector('h2').textContent).toEqual('');

    http.expectOne('/resources/i18n/en.json').flush(TRANSLATIONS_EN);
    http.expectNone('/resources/i18n/de.json');

    // Finally, assert that there are no outstanding requests.
    http.verify();

    fixture.detectChanges();
    // the main link to open up the dropdown should now say English
    expect(el.querySelector('a').textContent).toEqual('English');

    translate.use('de');
    http.expectOne('/resources/i18n/de.json').flush(TRANSLATIONS_DE);

    // Finally, assert that there are no outstanding requests.
    http.verify();

    // the content has not changed yet
    expect(el.querySelector('a').textContent).toEqual('English');

    fixture.detectChanges();
    // the main link to open up the dropdown should now say Deutsch
    expect(el.querySelector('a').textContent).toEqual('Deutsch');
  }));

});
