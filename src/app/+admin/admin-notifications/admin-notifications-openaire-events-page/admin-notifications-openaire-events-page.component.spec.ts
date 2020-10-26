import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsOpenaireEventsPageComponent } from './admin-notifications-openaire-events-page.component';

describe('AdminNotificationsOpenaireEventsPageComponent', () => {
  let component: AdminNotificationsOpenaireEventsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsOpenaireEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsOpenaireEventsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsOpenaireEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsOpenaireEventsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
