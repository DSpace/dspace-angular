import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-claimed-task-actions-reject',
  styleUrls: ['./claimed-task-actions-reject.component.scss'],
  templateUrl: './claimed-task-actions-reject.component.html',
})

export class ClaimedTaskActionsRejectComponent implements OnInit {
  @Input() processingReject: boolean;
  @Input() taskId: string;
  @Input() wrapperClass: string;

  @Output() reject: EventEmitter<string> = new EventEmitter<string>();

  public rejectForm: FormGroup;
  public modalRef: NgbModalRef;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

  }

  click() {
    this.processingReject = true;
    this.modalRef.close('Send Button');
    const reason = this.rejectForm.get('reason').value;
    this.reject.emit(reason);
  }

  openRejectModal(rejectModal) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(rejectModal);
  }
}
