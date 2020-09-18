import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SiteDataService } from 'src/app/core/data/site-data.service';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { Site } from 'src/app/core/shared/site.model';
import { EndUserAgreementContentComponent } from './end-user-agreement-content.component';

describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;

  let siteServiceStub: any;
  let localeServiceStub: any;

  const site: Site = Object.assign(new Site(), {
    metadata: {
      'dc.rights' : [{
        value: 'This is the End User Agreement text for this test\nwith many\nlines',
        language: 'en'
      },
      {
        value: 'Dies ist der Text der Endbenutzervereinbarung für diesen Test',
        language: 'de'
      }]
    }
  });

  beforeEach(async(() => {

    localeServiceStub = {
      getCurrentLanguageCode(): string {
        return 'en';
      }
    }
    siteServiceStub = {
      find(): Observable<Site> {
        return of(site);
      }
    }
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ],
      declarations: [ EndUserAgreementContentComponent],
      providers: [{ provide: SiteDataService, useValue: siteServiceStub },
                  { provide: LocaleService, useValue: localeServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserAgreementContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the dc.rights value in many paragraphs', () => {
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    expect(paragraphs.length).toEqual(3);
    expect(paragraphs[0].nativeElement.textContent).toEqual('This is the End User Agreement text for this test');
    expect(paragraphs[1].nativeElement.textContent).toEqual('with many');
    expect(paragraphs[2].nativeElement.textContent).toEqual('lines');
  });

});
