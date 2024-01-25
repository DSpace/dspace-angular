import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsPublicationClaimPageComponent } from './admin-notifications-publication-claim-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

describe('AdminNotificationsPublicationClaimPageComponent', () => {
  let component: AdminNotificationsPublicationClaimPageComponent;
  let fixture: ComponentFixture<AdminNotificationsPublicationClaimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AdminNotificationsPublicationClaimPageComponent
      ],
      providers: [
        AdminNotificationsPublicationClaimPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsPublicationClaimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
