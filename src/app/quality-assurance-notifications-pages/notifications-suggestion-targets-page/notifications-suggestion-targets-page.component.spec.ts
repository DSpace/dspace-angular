import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSuggestionTargetsPageComponent } from './notifications-suggestion-targets-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  AdminNotificationsPublicationClaimPageComponent
} from '../../admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component';

describe('NotificationsSuggestionTargetsPageComponent', () => {
  let component: NotificationsSuggestionTargetsPageComponent;
  let fixture: ComponentFixture<NotificationsSuggestionTargetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        NotificationsSuggestionTargetsPageComponent
      ],
      providers: [
        AdminNotificationsPublicationClaimPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSuggestionTargetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
