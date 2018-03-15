import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { DeduplicationSchema } from '../../../../core/submission/models/workspaceitem-section-deduplication.model';
import { SubmissionService, WORKFLOW_SCOPE, WORKSPACE_SCOPE } from '../../../submission.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../../submission.reducers';
import { DeduplicationService } from '../deduplication.service';
import { SetWorkflowDuplicatedAction, SetWorkspaceDuplicatedAction } from '../../../objects/submission-objects.actions';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';

@Component({
  selector: 'ds-deduplication-match',
  templateUrl: 'deduplication-match.component.html',
})

export class DeduplicationMatchComponent implements OnInit {
  @Input()
  sectionId: string;
  @Input()
  match: DeduplicationSchema;
  @Input()
  submissionId: string;
  @Input()
  index: string;

  object = {hitHighlights: []};
  item: Item;
  isWorkFlow = false;
  showSubmitterDecision = false;
  submitterDecisionTxt: string;

  decidedYet: boolean;

  closeResult: string; // for modal
  rejectForm: FormGroup;
  modalRef: NgbModalRef;
  pathCombiner: JsonPatchOperationPathCombiner;

  constructor(private deduplicationService: DeduplicationService,
              private submissionService: SubmissionService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private store: Store<SubmissionState>,
              protected operationsBuilder: JsonPatchOperationsBuilder,) {
  }

  ngOnInit(): void {
    if ((this.match.matchObject as any).item) {
      // WSI & WFI
      this.item = Object.assign(new Item(), (this.match.matchObject as any).item);
    } else {
      // Item
      this.item = Object.assign(new Item(), this.match.matchObject);
    }

    this.isWorkFlow = this.submissionService.getSubmissionScope() === WORKFLOW_SCOPE ? true : false;

    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

    this.decidedYet = this.isWorkFlow ?
      this.match.workflowDecision !== null ? true : false
      : this.match.submitterDecision !== null ? true : false;

    if (this.match.submitterDecision) {
      if (this.match.submitterDecision === 'verify') {
        this.submitterDecisionTxt = 'It\'s a duplicate';
      } else {
        this.submitterDecisionTxt = 'It\'s not a duplicate';
      }
    } else {
      this.submitterDecisionTxt = 'Not decided';
    }

    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'matches', this.index);
  }

  setAsDuplicated() {
    console.log('Setting item #' + this.item.uuid + ' as duplicated...');
    this.dispatchAction(true);
    this.modalRef.dismiss();
  }

  setAsNotDuplicated() {
    console.log('Setting item #' + this.item.uuid + ' as not duplicated...');
    this.dispatchAction(false);
  }

  clearDecision() {
    console.log('Clearing item #' + this.item.uuid + ' from previous decision...');

  }

  private dispatchAction(duplicated: boolean, clear?: boolean): void {
    const payload = {
      submissionId: this.submissionId,
      index: this.index,
      data: {} as DeduplicationSchema
    };

    // Call workflow action
    const decision = clear ? null : duplicated ? 'verify' : 'reject';
    const pathDecision = this.isWorkFlow ? 'workflowDecision' : 'submitterDecision';
    this.operationsBuilder.add(this.pathCombiner.getPath(pathDecision), decision, false, true);

    if (!clear && duplicated) {
      const note = this.rejectForm.get('reason').value;
      const pathNote = this.isWorkFlow ? 'workflowNote' : 'submitterNote';
      this.operationsBuilder.add(this.pathCombiner.getPath(pathNote), note, false, true);
    }

    // const now = new Date();
    // const time = now.getUTCFullYear() + '/' + now.getUTCMonth() + 1 + '/' + now.getDay();

    // if (this.isWorkFlow) {
    //   // Call workflow action
    //   payload.data.workflowDecision = clear ? null : duplicated ? 'verify' : 'reject';
    //   // payload.data.workflowTime = time;
    //   if (!clear && duplicated) {
    //     const note = this.rejectForm.get('reason').value;
    //     payload.data.workflowNote = note;
    //   }
    //   // Dispatch WorkFLOW action
    //   // this.store.dispatch(new SetWorkflowDuplicatedAction(payload));
    //   const path = 'workflowDecision'
    //   this.operationsBuilder.add(this.pathCombiner.getPath(path), payload.data.workflowDecision, false, true);
    //
    // } else {
    //   // Call workspace action
    //   payload.data.submitterDecision = clear ? null : duplicated ? 'verify' : 'reject';
    //   // payload.data.submitterTime = time;
    //   if (!clear && duplicated) {
    //     const note = this.rejectForm.get('reason').value;
    //     payload.data.submitterNote = note;
    //   }
    //   // Dispatch workSPACE action
    //   this.store.dispatch(new SetWorkspaceDuplicatedAction(payload));
    // }
  }

  toggleSubmitterDecision() {
    this.showSubmitterDecision = !this.showSubmitterDecision;
  }

  openModal(modal) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(modal);
  }

}
