import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyOutgoingComponent } from './admin-notify-outgoing.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AdminNotifyLogsComponent', () => {
  let component: AdminNotifyOutgoingComponent;
  let fixture: ComponentFixture<AdminNotifyOutgoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifyOutgoingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
