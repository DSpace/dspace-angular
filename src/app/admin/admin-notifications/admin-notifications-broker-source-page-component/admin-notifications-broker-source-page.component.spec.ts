import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsBrokerSourcePageComponent } from './admin-notifications-broker-source-page.component';

describe('AdminNotificationsBrokerSourcePageComponent', () => {
  let component: AdminNotificationsBrokerSourcePageComponent;
  let fixture: ComponentFixture<AdminNotificationsBrokerSourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotificationsBrokerSourcePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotificationsBrokerSourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
