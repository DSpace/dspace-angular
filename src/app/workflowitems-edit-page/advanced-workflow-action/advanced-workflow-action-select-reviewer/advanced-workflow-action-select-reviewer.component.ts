import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  rendersAdvancedWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { AdvancedWorkflowActionComponent } from '../advanced-workflow-action/advanced-workflow-action.component';
import { WorkflowAction } from '../../../core/tasks/models/workflow-action-object.model';
import {
  SelectReviewerActionAdvancedInfo
} from '../../../core/tasks/models/select-reviewer-action-advanced-info.model';
import {
  EPersonListActionConfig
} from '../../../access-control/group-registry/group-form/members-list/members-list.component';
import { Subscription } from 'rxjs';
import { EPerson } from '../../../core/eperson/models/eperson.model';

export const WORKFLOW_ADVANCED_TASK_OPTION_SELECT_REVIEWER = 'submit_select_reviewer';
export const ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER = 'selectrevieweraction';

@rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER)
@Component({
  selector: 'ds-advanced-workflow-action-select-reviewer',
  templateUrl: './advanced-workflow-action-select-reviewer.component.html',
  styleUrls: ['./advanced-workflow-action-select-reviewer.component.scss'],
})
export class AdvancedWorkflowActionSelectReviewerComponent extends AdvancedWorkflowActionComponent implements OnInit, OnDestroy {

  multipleReviewers = true;

  selectedReviewers: EPerson[] = [];

  reviewersListActionConfig: EPersonListActionConfig;

  /**
   * When the component is created the value is `undefined`, afterwards it will be set to either the group id or `null`.
   * It needs to be subscribed in the **ngOnInit()** because otherwise some unnecessary request will be made.
   */
  groupId?: string | null;

  subs: Subscription[] = [];

  displayError = false;

  ngOnDestroy(): void {
    this.subs.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.multipleReviewers) {
      this.reviewersListActionConfig = {
        add: {
          css: 'btn-outline-primary',
          disabled: false,
          icon: 'fas fa-plus',
        },
        remove: {
          css: 'btn-outline-danger',
          disabled: false,
          icon: 'fas fa-minus'
        },
      };
    } else {
      this.reviewersListActionConfig = {
        add: {
          css: 'btn-outline-primary',
          disabled: false,
          icon: 'fas fa-check',
        },
        remove: {
          css: 'btn-primary',
          disabled: true,
          icon: 'fas fa-check'
        },
      };
    }
    this.subs.push(this.workflowAction$.subscribe((workflowAction: WorkflowAction) => {
      if (workflowAction) {
        this.groupId = (workflowAction.advancedInfo as SelectReviewerActionAdvancedInfo[])[0].group;
      } else {
        this.groupId = null;
      }
    }));
  }

  getType(): string {
    return ADVANCED_WORKFLOW_ACTION_SELECT_REVIEWER;
  }

  performAction(): void {
    if (this.selectedReviewers.length > 0) {
      super.performAction();
    } else {
      this.displayError = true;
    }
    console.log(this.displayError);
  }

  createBody(): any {
    return {
      [WORKFLOW_ADVANCED_TASK_OPTION_SELECT_REVIEWER]: true,
      eperson: this.selectedReviewers.map((ePerson: EPerson) => ePerson.id),
    };
  }

}
