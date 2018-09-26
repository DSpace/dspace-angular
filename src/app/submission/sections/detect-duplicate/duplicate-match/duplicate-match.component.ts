import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { DetectDuplicateMatch } from '../../../../core/submission/models/workspaceitem-section-deduplication.model';
import { SubmissionService } from '../../../submission.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../../submission.reducers';
import { DeduplicationService } from '../deduplication.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SubmissionScopeType } from '../../../../core/submission/submission-scope-type';
import { DuplicateDecisionValue } from '../models/duplicate-decision-value';
import { DuplicateDecision } from '../models/duplicate-decision.model';
import { DuplicateDecisionType } from '../models/duplicate-decision-type';
import { SaveSubmissionSectionFormAction } from '../../../objects/submission-objects.actions';
import { match } from 'minimatch';
import { isNotEmpty } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-duplicate-match',
  templateUrl: 'duplicate-match.component.html',
})

export class DuplicateMatchComponent implements OnInit {
  @Input() sectionId: string;
  @Input() itemId: string;
  @Input() match: DetectDuplicateMatch;
  @Input() submissionId: string;
  @Input() index: string;

  object = {hitHighlights: []};
  item: Item;
  isWorkFlow = false;
  showSubmitterDecision = false;
  decisionType: DuplicateDecisionType;
  submitterDecisionTxt: string;

  hasDecision: boolean;

  closeResult: string; // for modal
  rejectForm: FormGroup;
  modalRef: NgbModalRef;
  pathCombiner: JsonPatchOperationPathCombiner;

  duplicatedBtnLabel: Observable<string>;
  submitterDecisionLabel: Observable<string>;

  constructor(private deduplicationService: DeduplicationService,
              private submissionService: SubmissionService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private store: Store<SubmissionState>,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              private translate: TranslateService) {
  }

  ngOnInit(): void {

    this.isWorkFlow = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkflowItem;
    this.decisionType = this.isWorkFlow ? DuplicateDecisionType.WORKFLOW : DuplicateDecisionType.WORKSPACE;
    this.item = Object.assign(new Item(), this.match.matchObject);

    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });

    this.hasDecision = this.isWorkFlow ?
      this.match.workflowDecision !== null
      : this.match.submitterDecision !== null;

    if (this.match.submitterDecision) {
      if (this.match.submitterDecision === 'verify') {
        this.submitterDecisionTxt = 'It\'s a duplicate';
      } else {
        this.submitterDecisionTxt = 'It\'s not a duplicate';
      }
    } else {
      this.submitterDecisionTxt = 'Not decided';
    }

    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId);

    this.duplicatedBtnLabel = this.isWorkFlow ?
      this.translate.get('submission.sections.deduplication.duplicated_ctrl')
      : this.translate.get('submission.sections.deduplication.duplicated');

    this.submitterDecisionLabel = this.isWorkFlow ?
      this.translate.get('submission.sections.deduplication.submitter_decision')
      : this.translate.get('submission.sections.deduplication.your_decision');

  }

  setAsDuplicate() {
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Verify,
      this.decisionType,
      this.rejectForm.get('reason').value);
    console.log('Setting item #' + this.item.uuid + ' as duplicated...');
    this.dispatchAction(decision);
    this.modalRef.dismiss();
  }

  setAsNotDuplicate() {
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Reject,
      this.decisionType);
    console.log('Setting item #' + this.item.uuid + ' as not duplicated...');
    this.dispatchAction(decision);
  }

  clearDecision() {
    console.log('Clearing item #' + this.item.uuid + ' from previous decision...');
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Undo,
      this.decisionType);
    console.log('Setting item #' + this.item.uuid + ' as not duplicated...');
    this.dispatchAction(decision);

  }

  private dispatchAction(decision: DuplicateDecision): void {
    const pathDecision = Array.of('matches', this.itemId, this.isWorkFlow ? 'workflowDecision' : 'submitterDecision').join('/');
    const payload = {
      value: isNotEmpty(decision.value) ? decision.value : null,
      note: isNotEmpty(decision.note) ? decision.note : null
    };

    this.operationsBuilder.add(this.pathCombiner.getPath(pathDecision), payload, false, true);
    this.store.dispatch(new SaveSubmissionSectionFormAction(this.submissionId, this.sectionId));
    // Call workflow action
    // const decision = clear ? null : duplicate ? 'verify' : 'reject';
    // const pathDecision = this.isWorkFlow ? 'workflowDecision' : 'submitterDecision';
    // this.operationsBuilder.add(this.pathCombiner.getPath(pathDecision), decision, false, true);
    //
    // if (!clear && duplicate) {
    //   const note = this.rejectForm.get('reason').value;
    //   const pathNote = this.isWorkFlow ? 'workflowNote' : 'submitterNote';
    //   this.operationsBuilder.add(this.pathCombiner.getPath(pathNote), note, false, true);
    // }

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
