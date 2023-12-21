import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';

describe('AdminNotifyDashboardComponent', () => {
  let component: AdminNotifyDashboardComponent;
  let fixture: ComponentFixture<AdminNotifyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
