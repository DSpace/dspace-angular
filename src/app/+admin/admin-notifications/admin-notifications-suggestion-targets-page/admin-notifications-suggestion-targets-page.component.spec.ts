import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsSuggestionTargetsPageComponent } from './admin-notifications-suggestion-targets-page.component';

describe('AdminNotificationsSuggestionTargetsPageComponent', () => {
  let component: AdminNotificationsSuggestionTargetsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsSuggestionTargetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsSuggestionTargetsPageComponent ]
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
