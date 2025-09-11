import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AdminNotifyMetricsBox } from '../../admin/admin-notify-dashboard/admin-notify-metrics/admin-notify-metrics.model';
import { NotificationBoxComponent } from './notification-box.component';

describe('NotificationBoxComponent', () => {
  let component: NotificationBoxComponent;
  let fixture: ComponentFixture<NotificationBoxComponent>;
  let mockBoxConfig: AdminNotifyMetricsBox;

  beforeEach(async () => {
    mockBoxConfig = {
      'color': '#D4EDDA',
      'title': 'admin-notify-dashboard.delivered',
      'config': 'NOTIFY.outgoing.delivered',
      'count': 79,
      'description': 'box description',
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NotificationBoxComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationBoxComponent);
    component = fixture.componentInstance;
    component.boxConfig = mockBoxConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
