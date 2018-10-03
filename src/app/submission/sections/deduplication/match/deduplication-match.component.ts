import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { DetectDuplicateMatch } from '../../../../core/submission/models/workspaceitem-section-deduplication.model';
import { SubmissionService } from '../../../submission.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetectDuplicateService } from '../detect-duplicate.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SubmissionScopeType } from '../../../../core/submission/submission-scope-type';
import { DuplicateDecisionValue } from '../models/duplicate-decision-value';
import { DuplicateDecision } from '../models/duplicate-decision.model';
import { DuplicateDecisionType } from '../models/duplicate-decision-type';
import { isNotEmpty } from '../../../../shared/empty.util';
import { SectionsService } from '../../sections.service';

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
  submitterDecision$: Observable<string>;
  submitterNote: string;

  hasDecision: boolean;

  closeResult: string; // for modal
  rejectForm: FormGroup;
  modalRef: NgbModalRef;
  pathCombiner: JsonPatchOperationPathCombiner;
  public processingVerify: Observable<boolean> = Observable.of(false);
  public processingReject: Observable<boolean> = Observable.of(false);
  decisionLabelClass: string;
  duplicateBtnLabel$: Observable<string>;
  notDuplicateBtnLabel$: Observable<string>;

  constructor(private detectDuplicateService: DetectDuplicateService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private sectionService: SectionsService,
              private submissionService: SubmissionService,
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
      this.submitterDecision$ = (this.match.submitterDecision === DuplicateDecisionValue.Reject) ?
        this.translate.get('submission.sections.detect-duplicate.not-duplicate') :
        this.translate.get('submission.sections.detect-duplicate.duplicate');
      this.decisionLabelClass = (this.match.submitterDecision === DuplicateDecisionValue.Reject) ? 'badge-success' : 'badge-warning';
      this.submitterNote = this.match.submitterNote;
    } else {
      this.submitterDecision$ = this.translate.get('submission.sections.detect-duplicate.no-decision');
      this.decisionLabelClass = 'badge-light';
    }

    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId);

    this.duplicateBtnLabel$ = this.isWorkFlow ?
      ((this.match.submitterDecision === DuplicateDecisionValue.Verify) ?
        this.translate.get('submission.sections.detect-duplicate.confirm-duplicate') :
        this.translate.get('submission.sections.detect-duplicate.duplicate-ctrl'))
      : this.translate.get('submission.sections.detect-duplicate.duplicate');

    this.notDuplicateBtnLabel$ = (this.isWorkFlow && this.match.submitterDecision === DuplicateDecisionValue.Reject) ?
      this.translate.get('submission.sections.detect-duplicate.confirm-not-duplicate') :
      this.translate.get('submission.sections.detect-duplicate.not-duplicate');

  }

  setAsDuplicate() {
    this.processingVerify = Observable.of(true);
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Verify,
      this.decisionType,
      this.rejectForm.get('reason').value);

    this.dispatchAction(decision);
    this.modalRef.dismiss();
  }

  setAsNotDuplicate() {
    this.processingReject = Observable.of(true);
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Reject,
      this.decisionType);

    this.dispatchAction(decision);
  }

  clearDecision() {
    const decision = new DuplicateDecision(
      DuplicateDecisionValue.Undo,
      this.decisionType);

    this.dispatchAction(decision);

  }

  private dispatchAction(decision: DuplicateDecision): void {
    const pathDecision = Array.of('matches', this.itemId, this.isWorkFlow ? 'workflowDecision' : 'submitterDecision').join('/');
    const payload = {
      value: isNotEmpty(decision.value) ? decision.value : null,
      note: isNotEmpty(decision.note) ? decision.note : null
    };

    // dispatch patch operation only when section is active
    this.sectionService.isSectionActive(this.submissionId, this.sectionId)
      .filter((isActive: boolean) => isActive)
      .take(1)
      .subscribe(() => {
        this.operationsBuilder.add(this.pathCombiner.getPath(pathDecision), payload, false, true);
        this.detectDuplicateService.saveDuplicateDecision(this.submissionId, this.sectionId)
      });

  }

  openModal(modal) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(modal);
  }

}
