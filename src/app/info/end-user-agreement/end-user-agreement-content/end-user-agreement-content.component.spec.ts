import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import {
  Observable,
  of,
} from 'rxjs';

import { SiteDataService } from '../../../core/data/site-data.service';
import { LocaleService } from '../../../core/locale/locale.service';
import { MathService } from '../../../core/shared/math.service';
import { Site } from '../../../core/shared/site.model';
import { EndUserAgreementContentComponent } from './end-user-agreement-content.component';

describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;

  let siteServiceStub: any;
  let localeServiceStub: any;

  const site: Site = Object.assign(new Site(), {
    metadata: {
      'dc.rights' : [{
        value: 'English text',
        language: 'en',
      },
      {
        value: 'German text',
        language: 'de',
      }],
    },
  });

  beforeEach(waitForAsync(() => {

    localeServiceStub = {
      getCurrentLanguageCode(): string {
        return 'es';
      },
    };
    siteServiceStub = {
      find(): Observable<Site> {
        return of(site);
      },
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EndUserAgreementContentComponent],
      providers: [{ provide: SiteDataService, useValue: siteServiceStub },
        { provide: LocaleService, useValue: localeServiceStub },
        { provide: MathService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(EndUserAgreementContentComponent, {
        remove: {
          imports: [RouterLink],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUserAgreementContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the English text as fallback', () => {
    expect(component.userAgreementText$).toBeObservable(cold('b', {
      b: 'English text',
    }));
  });

});
