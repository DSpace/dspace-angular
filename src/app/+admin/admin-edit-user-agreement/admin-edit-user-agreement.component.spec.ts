import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ScriptDataService } from 'src/app/core/data/processes/script-data.service';
import { SiteDataService } from 'src/app/core/data/site-data.service';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { Site } from 'src/app/core/shared/site.model';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { NotificationsServiceStub } from 'src/app/shared/testing/notifications-service.stub';
import { AdminEditUserAgreementComponent } from './admin-edit-user-agreement.component';

fdescribe('AdminEditUserAgreementComponent', () => {

  let component: AdminEditUserAgreementComponent;
  let fixture: ComponentFixture<AdminEditUserAgreementComponent>;

  let notificationService: NotificationsServiceStub;
  let siteService: any;
  let scriptDataService: any;

  const site: Site = Object.assign(new Site(), {
    metadata: {
      'dc.rights' : [{
        value: 'This is the End User Agreement text for this test'
      }]
    }
  });

  beforeEach(async(() => {

    notificationService = new NotificationsServiceStub();
    siteService = {
      find(): Observable<Site> {
        return of(site);
      }
    }

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [AdminEditUserAgreementComponent],
      providers: [AdminEditUserAgreementComponent,
        { provide: NotificationsService, useValue: notificationService },
        { provide: SiteDataService, useValue: siteService },
        { provide: ScriptDataService, useValue: scriptDataService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditUserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminEditUserAgreementComponent', inject([AdminEditUserAgreementComponent], (comp: AdminEditUserAgreementComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should fill the text area with the dc.rights value', async(() => {
    expect(component.userAgreementText).toEqual('This is the End User Agreement text for this test');
  }));

});
