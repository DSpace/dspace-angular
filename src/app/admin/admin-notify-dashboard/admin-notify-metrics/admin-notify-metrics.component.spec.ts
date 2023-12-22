import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyMetricsComponent } from './admin-notify-metrics.component';

describe('AdminNotifyMetricsComponent', () => {
  let component: AdminNotifyMetricsComponent;
  let fixture: ComponentFixture<AdminNotifyMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
