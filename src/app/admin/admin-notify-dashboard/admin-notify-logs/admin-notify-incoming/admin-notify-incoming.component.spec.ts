import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyIncomingComponent } from './admin-notify-incoming.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";

describe('AdminNotifyLogsComponent', () => {
  let component: AdminNotifyIncomingComponent;
  let fixture: ComponentFixture<AdminNotifyIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifyIncomingComponent ],
      providers: [ActivatedRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
