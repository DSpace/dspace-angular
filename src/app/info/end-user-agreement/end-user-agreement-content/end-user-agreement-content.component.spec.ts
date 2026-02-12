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

let localeService: any;

const TEST_MODEL = new ResourceType('testmodel');

const mockDataServiceMap: any = new Map([
  [TEST_MODEL.value, () => import('../../../core/testing/test-data-service.mock').then(m => m.TestDataService)],
]);

const languageList = ['en;q=1', 'de;q=0.8'];
const mockLocaleService = jasmine.createSpyObj('LocaleService', {
  getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
  getLanguageCodeList: of(languageList),
});

describe('EndUserAgreementContentComponent', () => {
  let component: EndUserAgreementContentComponent;
  let fixture: ComponentFixture<EndUserAgreementContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EndUserAgreementContentComponent],
      providers: [
        EndUserAgreementContentComponent,
        provideMockStore({
          initialState: {
            index: {
            },
          },
        }),
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
        { provide: APP_CONFIG, useValue: environment },
        { provide: LocaleService, useValue: mockLocaleService },
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
    localeService = TestBed.inject(LocaleService);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
