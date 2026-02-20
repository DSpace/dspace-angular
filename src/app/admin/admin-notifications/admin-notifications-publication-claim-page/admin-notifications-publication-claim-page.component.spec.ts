import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { SuggestionSourcesComponent } from '../../../notifications/suggestions/sources/suggestion-sources.component';
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
        MockComponent(SuggestionSourcesComponent),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
