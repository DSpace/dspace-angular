import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { rendersWorkflowTaskOption } from '../switcher/claimed-task-actions-decorator';

export const WORKFLOW_TASK_OPTION_REJECT = 'submit_reject';

@rendersWorkflowTaskOption(WORKFLOW_TASK_OPTION_REJECT)
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
   * This component represents the reject option
   */
  option = WORKFLOW_TASK_OPTION_REJECT;

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
    super(claimedTaskService);
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
   * Create the request body for rejecting a workflow task
   * Includes the reason from the form
   */
  createbody(): any {
    const reason = this.rejectForm.get('reason').value;
    return Object.assign(super.createbody(), { reason });
  }

  /**
   * Submit a reject option for the task
   */
  submitTask() {
    this.modalRef.close('Send Button');
    super.submitTask();
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
