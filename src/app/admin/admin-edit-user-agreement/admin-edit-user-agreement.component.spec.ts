import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { Site } from '../../core/shared/site.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AdminEditUserAgreementComponent } from './admin-edit-user-agreement.component';

const TEST_MODEL = new ResourceType('testmodel');

const mockDataServiceMap: any = new Map([
  [TEST_MODEL.value, () => import('../../core/testing/test-data-service.mock').then(m => m.TestDataService)],
]);

describe('AdminEditUserAgreementComponent', () => {

  let component: AdminEditUserAgreementComponent;
  let fixture: ComponentFixture<AdminEditUserAgreementComponent>;

  let notificationService: NotificationsServiceStub;
  let siteService: any;
  let scriptDataService: any;

  const site: Site = Object.assign(new Site(), {
    metadata: {
      'dc.rights' : [{
        value: 'This is the End User Agreement text for this test',
        language: 'en',
      },
      {
        value: 'Dies ist der Text der Endbenutzervereinbarung für diesen Test',
        language: 'de',
      }],
    },
  });

  beforeEach(waitForAsync(() => {

    scriptDataService = {};
    notificationService = new NotificationsServiceStub();
    siteService = {
      find(): Observable<Site> {
        return of(site);
      },
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }), AdminEditUserAgreementComponent],
      providers: [AdminEditUserAgreementComponent,
        provideMockStore({
          initialState: {
            index: {
            },
          },
        }),
        { provide: APP_DATA_SERVICES_MAP, useValue: mockDataServiceMap },
        { provide: NotificationsService, useValue: notificationService },
        { provide: SiteDataService, useValue: siteService },
        { provide: ScriptDataService, useValue: scriptDataService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AdminEditUserAgreementComponent, { remove: { imports: [AlertComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditUserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminEditUserAgreementComponent', inject([AdminEditUserAgreementComponent], (comp: AdminEditUserAgreementComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should fill the text areas with the dc.rights values', waitForAsync(() => {
    expect(component.userAgreementTexts.get('en').text).toEqual('This is the End User Agreement text for this test');
    expect(component.userAgreementTexts.get('de').text).toEqual('Dies ist der Text der Endbenutzervereinbarung für diesen Test');
  }));

});
