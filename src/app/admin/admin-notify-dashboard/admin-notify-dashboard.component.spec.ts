import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

describe('AdminNotifyDashboardComponent', () => {
  let component: AdminNotifyDashboardComponent;
  let fixture: ComponentFixture<AdminNotifyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbNavModule],
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
