import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AdminNotificationsPublicationClaimPageComponent } from '../../admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component';
import { PublicationClaimComponent } from '../../notifications/suggestion-targets/publication-claim/publication-claim.component';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { NotificationsSuggestionTargetsPageComponent } from './notifications-suggestion-targets-page.component';

describe('NotificationsSuggestionTargetsPageComponent', () => {
  let component: NotificationsSuggestionTargetsPageComponent;
  let fixture: ComponentFixture<NotificationsSuggestionTargetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        NotificationsSuggestionTargetsPageComponent,
      ],
      providers: [
        AdminNotificationsPublicationClaimPageComponent,
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(NotificationsSuggestionTargetsPageComponent, {
        remove: {
          providers: [PublicationClaimComponent],
        },
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
