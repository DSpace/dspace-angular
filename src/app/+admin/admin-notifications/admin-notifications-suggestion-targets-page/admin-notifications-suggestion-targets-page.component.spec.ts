import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsSuggestionTargetsPageComponent } from './admin-notifications-suggestion-targets-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

describe('AdminNotificationsSuggestionTargetsPageComponent', () => {
  let component: AdminNotificationsSuggestionTargetsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsSuggestionTargetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AdminNotificationsSuggestionTargetsPageComponent
      ],
      providers: [
        AdminNotificationsSuggestionTargetsPageComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsSuggestionTargetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
