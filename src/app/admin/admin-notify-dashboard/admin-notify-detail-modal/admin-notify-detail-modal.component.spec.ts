import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyDetailModalComponent } from './admin-notify-detail-modal.component';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe('AdminNotifyDetailModalComponent', () => {
  let component: AdminNotifyDetailModalComponent;
  let fixture: ComponentFixture<AdminNotifyDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyDetailModalComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
