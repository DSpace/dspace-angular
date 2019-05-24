import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-claimed-task-actions-reject',
  styleUrls: ['./claimed-task-actions-reject.component.scss'],
  templateUrl: './claimed-task-actions-reject.component.html',
})

export class ClaimedTaskActionsRejectComponent implements OnInit {

  /**
   * A boolean representing if a reject operation is pending
   */
  @Input() processingReject: boolean;

  /**
   * CSS classes to append to reject button
   */
  @Input() wrapperClass: string;

  /**
   * An event fired when a reject action is confirmed.
   * Event's payload equals to reject reason.
   */
  @Output() reject: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The reject form group
   */
  public rejectForm: FormGroup;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * Initialize instance variables
   *
   * @param {FormBuilder} formBuilder
   * @param {NgbModal} modalService
   */
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal) {
  }

  /**
   * Initialize form
   */
  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

  }

  /**
   * Close modal and emit reject event
   */
  confirmReject() {
    this.processingReject = true;
    this.modalRef.close('Send Button');
    const reason = this.rejectForm.get('reason').value;
    this.reject.emit(reason);
  }

  /**
   * Open modal
   *
   * @param content
   */
  openRejectModal(content: any) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(content);
  }
}
