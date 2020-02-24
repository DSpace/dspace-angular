import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';

@rendersWorkflowTaskOption('submit_reject')
@Component({
  selector: 'ds-claimed-task-actions-reject',
  styleUrls: ['./claimed-task-actions-reject.component.scss'],
  templateUrl: './claimed-task-actions-reject.component.html',
})
/**
 * Component for displaying and processing the reject action on a workflow task item
 */
export class ClaimedTaskActionsRejectComponent extends ClaimedTaskActionsAbstractComponent implements OnInit {
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
   * @param claimedTaskService
   */
  constructor(protected claimedTaskService: ClaimedTaskDataService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
    super();
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
   * Reject the task
   */
  process() {
    this.processing$.next(true);
    const reason = this.rejectForm.get('reason').value;
    this.modalRef.close('Send Button');
    this.claimedTaskService.rejectTask(reason, this.object.id)
      .subscribe((res: ProcessTaskResponse) => {
        this.processing$.next(false);
        this.processCompleted.emit(res.hasSucceeded);
      });
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
