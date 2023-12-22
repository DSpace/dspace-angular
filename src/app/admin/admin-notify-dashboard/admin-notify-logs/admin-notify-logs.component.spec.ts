import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyLogsComponent } from './admin-notify-logs.component';

describe('AdminNotifyLogsComponent', () => {
  let component: AdminNotifyLogsComponent;
  let fixture: ComponentFixture<AdminNotifyLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
