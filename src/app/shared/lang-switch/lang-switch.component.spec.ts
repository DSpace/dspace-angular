import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {LangSwitchComponent} from "./lang-switch.component";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import { GLOBAL_CONFIG } from '../../../config';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable} from "rxjs";
import {of} from "rxjs/observable/of";
import {LangConfig} from "../../../config/lang-config.interface";


//This test is completely independent from any message catalogs or keys in the codebase
//The translation module is instantiated with these bogus messages that we aren't using anyway.
class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      "footer": {
        "copyright": "copyright © 2002-{{ year }}",
        "link.dspace": "DSpace software",
        "link.duraspace": "DuraSpace"
      }
    });
  }
}

describe('LangSwitchComponent', () => {

  describe('with English and Deutsch activated, English as default', () => {
    let component: LangSwitchComponent;
    let fixture: ComponentFixture<LangSwitchComponent>;
    let de: DebugElement;
    let langSwitchElement: HTMLElement;

    let translate: TranslateService;
    let http: HttpTestingController;

    beforeEach(async(() => {

      const mockConfig = {
        languages: [{
          code: 'en',
          label: 'English',
          active: true,
        }, {
          code: 'de',
          label: 'Deutsch',
          active: true,
        }]
      };

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, TranslateModule.forRoot(
          {
            loader: {provide: TranslateLoader, useClass: CustomLoader}
          }
        )],
        declarations: [LangSwitchComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [TranslateService, {provide: GLOBAL_CONFIG, useValue: mockConfig}]
      }).compileComponents()
        .then(() => {
          translate = TestBed.get(TranslateService);
          translate.addLangs(mockConfig.languages.filter((langConfig:LangConfig) => langConfig.active === true).map(a => a.code));
          translate.setDefaultLang('en');
          translate.use('en');
          http = TestBed.get(HttpTestingController);
          fixture = TestBed.createComponent(LangSwitchComponent);
          component = fixture.componentInstance;
          de = fixture.debugElement;
          langSwitchElement = de.nativeElement;
        });
    }));

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should identify English as the label for the current active language in the component', async(() => {
      fixture.detectChanges();
      expect(component.currentLangLabel()).toEqual('English');
    }));

    it('should be initialized with more than one language active', async(() => {
      fixture.detectChanges();
      expect(component.moreThanOneLanguage).toBeTruthy();
    }));

    it('should define the main A HREF in the UI', (() => {
      expect(langSwitchElement.querySelector('a')).toBeDefined();
    }));

    it('should show English in the UI as the label for the language dropdown', async(() => {
      spyOn(translate, 'getBrowserLang').and.returnValue('en');
      fixture.detectChanges();
      // the main link to open up the dropdown should now say English
      expect(langSwitchElement.querySelector('a').textContent.trim()).toEqual('English');
    }));
  });

  describe('with English as the only active and also default language', () => {

    let component: LangSwitchComponent;
    let fixture: ComponentFixture<LangSwitchComponent>;
    let de: DebugElement;
    let langSwitchElement: HTMLElement;

    let translate: TranslateService;
    let http: HttpTestingController;

    beforeEach(async(() => {

      const mockConfig = {
        languages: [{
          code: 'en',
          label: 'English',
          active: true,
        }, {
          code: 'de',
          label: 'Deutsch',
          active: false
        }]
      };

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, TranslateModule.forRoot(
          {
            loader: {provide: TranslateLoader, useClass: CustomLoader}
          }
        )],
        declarations: [LangSwitchComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [TranslateService, {provide: GLOBAL_CONFIG, useValue: mockConfig}]
      }).compileComponents();
      translate = TestBed.get(TranslateService);
      translate.addLangs(mockConfig.languages.filter(LangConfig => LangConfig.active === true).map(a => a.code));
      translate.setDefaultLang('en');
      translate.use('en');
      http = TestBed.get(HttpTestingController);
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LangSwitchComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      langSwitchElement = de.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should not define the main header for the language switch, as it should be invisible', (() => {
      expect(langSwitchElement.querySelector('a')).toBeNull();
    }));

  });

});
