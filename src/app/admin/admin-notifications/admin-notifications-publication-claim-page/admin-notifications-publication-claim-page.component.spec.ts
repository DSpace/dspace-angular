import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { PublicationClaimComponent } from '../../../notifications/suggestion-targets/publication-claim/publication-claim.component';
import { AdminNotificationsPublicationClaimPageComponent } from './admin-notifications-publication-claim-page.component';

describe('AdminNotificationsPublicationClaimPageComponent', () => {
  let component: AdminNotificationsPublicationClaimPageComponent;
  let fixture: ComponentFixture<AdminNotificationsPublicationClaimPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        AdminNotificationsPublicationClaimPageComponent,
      ],
      providers: [
        AdminNotificationsPublicationClaimPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AdminNotificationsPublicationClaimPageComponent, {
      remove: {
        imports: [PublicationClaimComponent],
      },
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
