import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page.component.spec.ts
import { NotificationsSuggestionTargetsPageComponent } from './notifications-suggestion-targets-page.component';
========
import { AdminNotificationsPublicationClaimPageComponent } from './admin-notifications-publication-claim-page.component';
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component.spec.ts
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page.component.spec.ts
describe('NotificationsSuggestionTargetsPageComponent', () => {
  let component: NotificationsSuggestionTargetsPageComponent;
  let fixture: ComponentFixture<NotificationsSuggestionTargetsPageComponent>;
========
describe('AdminNotificationsPublicationClaimPageComponent', () => {
  let component: AdminNotificationsPublicationClaimPageComponent;
  let fixture: ComponentFixture<AdminNotificationsPublicationClaimPageComponent>;
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component.spec.ts

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page.component.spec.ts
        NotificationsSuggestionTargetsPageComponent
      ],
      providers: [
        NotificationsSuggestionTargetsPageComponent
========
        AdminNotificationsPublicationClaimPageComponent
      ],
      providers: [
        AdminNotificationsPublicationClaimPageComponent
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component.spec.ts
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<<< HEAD:src/app/quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page.component.spec.ts
    fixture = TestBed.createComponent(NotificationsSuggestionTargetsPageComponent);
========
    fixture = TestBed.createComponent(AdminNotificationsPublicationClaimPageComponent);
>>>>>>>> main:src/app/admin/admin-notifications/admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
