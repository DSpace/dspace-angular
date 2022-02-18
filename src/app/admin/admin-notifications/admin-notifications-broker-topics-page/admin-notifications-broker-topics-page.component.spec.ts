import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotificationsBrokerTopicsPageComponent } from './admin-notifications-broker-topics-page.component';

describe('AdminNotificationsBrokerTopicsPageComponent', () => {
  let component: AdminNotificationsBrokerTopicsPageComponent;
  let fixture: ComponentFixture<AdminNotificationsBrokerTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotificationsBrokerTopicsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsBrokerTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminNotificationsBrokerTopicsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
