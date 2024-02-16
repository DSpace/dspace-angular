import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  NotificationsSuggestionTargetsPageComponent
} from '../../../quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page.component';

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
        NotificationsSuggestionTargetsPageComponent
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
