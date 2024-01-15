import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyLogsResultComponent } from './admin-notify-logs-result.component';

describe('AdminNotifyLogsComponent', () => {
  let component: AdminNotifyLogsResultComponent;
  let fixture: ComponentFixture<AdminNotifyLogsResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyLogsResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyLogsResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
