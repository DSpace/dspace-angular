import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { RatingAdvancedWorkflowInfo } from '../../../core/tasks/models/rating-advanced-workflow-info.model';
import { WorkflowAction } from '../../../core/tasks/models/workflow-action-object.model';
import { ModifyItemOverviewComponent } from '../../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { ClaimedTaskType } from '../../../shared/mydspace-actions/claimed-task/claimed-task-type';
import { rendersAdvancedWorkflowTaskOption } from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { VarDirective } from '../../../shared/utils/var.directive';
import { AdvancedWorkflowActionComponent } from '../advanced-workflow-action/advanced-workflow-action.component';
import { AdvancedWorkflowActionType } from '../advanced-workflow-action-type';

/**
 * The page on which reviewers can rate submitted items.
 */
@Component({
  selector: 'ds-advanced-workflow-action-rating-reviewer',
  templateUrl: './advanced-workflow-action-rating.component.html',
  styleUrls: ['./advanced-workflow-action-rating.component.scss'],
  preserveWhitespaces: false,
  imports: [
    AsyncPipe,
    ModifyItemOverviewComponent,
    NgbRatingModule,
    NgClass,
    ReactiveFormsModule,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
@rendersAdvancedWorkflowTaskOption(AdvancedWorkflowActionType.ADVANCED_WORKFLOW_ACTION_RATING)
export class AdvancedWorkflowActionRatingComponent extends AdvancedWorkflowActionComponent implements OnInit {

  ratingForm: UntypedFormGroup;

  ngOnInit(): void {
    super.ngOnInit();
    this.ratingForm = new UntypedFormGroup({
      review: new UntypedFormControl(''),
      rating: new UntypedFormControl(0, Validators.min(1)),
    });
  }

  /**
   * Only run **performAction()** when the form has been correctly filled in
   */
  performAction(): void {
    this.ratingForm.updateValueAndValidity();
    if (this.ratingForm.valid) {
      super.performAction();
    } else {
      this.ratingForm.markAllAsTouched();
    }
  }

  /**
   * Returns the task option, the score and the review if one was provided
   */
  createBody(): any {
    const body = {
      [ClaimedTaskType.ADVANCED_WORKFLOW_TASK_OPTION_RATING]: true,
      score: this.ratingForm.get('rating').value,
    };
    if (this.ratingForm.get('review').value !== '') {
      const review: string = this.ratingForm.get('review').value;
      Object.assign(body, { review: review });
    }
    return body;
  }

  getType(): string {
    return AdvancedWorkflowActionType.ADVANCED_WORKFLOW_ACTION_RATING;
  }

  getAdvancedInfo(workflowAction: WorkflowAction | null): RatingAdvancedWorkflowInfo | null {
    return workflowAction ? (workflowAction.advancedInfo[0] as RatingAdvancedWorkflowInfo) : null;
  }

  /**
   * Returns whether the field is valid or not.
   *
   * @param formControlName The input field
   */
  isInvalid(formControlName: string): boolean {
    return this.ratingForm.get(formControlName).touched && !this.ratingForm.get(formControlName).valid;
  }

}
