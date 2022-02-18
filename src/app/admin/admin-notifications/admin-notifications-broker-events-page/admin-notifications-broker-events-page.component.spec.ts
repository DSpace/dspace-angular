import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsBrokerEventsPageComponent } from './admin-notifications-broker-events-page.component';

describe('AdminNotificationsBrokerEventsPageComponent', () => {
  let component: AdminNotificationsBrokerEventsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsBrokerEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsBrokerEventsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsBrokerEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsBrokerEventsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
