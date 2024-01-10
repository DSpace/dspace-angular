import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotifyDetailModalComponent } from './admin-notify-detail-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

describe('AdminNotifyDetailModalComponent', () => {
  let component: AdminNotifyDetailModalComponent;
  let fixture: ComponentFixture<AdminNotifyDetailModalComponent>;
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifyDetailModalComponent ],
      providers: [{ provide: NgbActiveModal, useValue: modalStub }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    spyOn(component.response, 'emit');
    component.closeModal();
    expect(modalStub.close).toHaveBeenCalled();
    expect(component.response.emit).toHaveBeenCalledWith(true);
  });
});
