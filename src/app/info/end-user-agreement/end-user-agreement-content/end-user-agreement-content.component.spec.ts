import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment.test';
import { EndUserAgreementContentComponent } from './end-user-agreement-content.component';

const TEST_MODEL = new ResourceType('testmodel');
const LANGUAGE_LIST = ['en;q=1', 'de;q=0.8'];
const MOCK_DATA_MAP = new Map([
  [TEST_MODEL.value, () => import('../../../core/testing/test-data-service.mock').then(m => m.TestDataService)],
]);
const INITIAL_STATE = {
  core: {
    auth: {
      authenticated: false,
      loaded: false,
      blocking: undefined,
      loading: false,
      authMethods: [],
    },
  },
};


describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;
  let localeServiceSpy: jasmine.SpyObj<LocaleService>;

  beforeEach(waitForAsync(() => {
    localeServiceSpy = jasmine.createSpyObj('LocaleService', [
      'getCurrentLanguageCode',
      'getLanguageCodeList',
    ]);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        EndUserAgreementContentComponent,
      ],
      providers: [
        provideMockStore({ initialState: INITIAL_STATE }),
        { provide: APP_DATA_SERVICES_MAP, useValue: MOCK_DATA_MAP },
        { provide: APP_CONFIG, useValue: environment },
        { provide: LocaleService, useValue: localeServiceSpy },
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
    localeServiceSpy.getCurrentLanguageCode.and.returnValue(of('en'));
    localeServiceSpy.getLanguageCodeList.and.returnValue(of(LANGUAGE_LIST));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
