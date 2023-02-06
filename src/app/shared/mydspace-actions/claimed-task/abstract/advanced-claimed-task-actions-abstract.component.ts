import { Component, OnInit } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from './claimed-task-actions-abstract.component';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { getAdvancedWorkflowRoute } from '../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';

/**
 * Abstract component for rendering an advanced claimed task's action
 * To create a child-component for a new option:
 * - Set the "{@link option}" and "{@link workflowType}" of the component
 * - Add a @{@link rendersWorkflowTaskOption} annotation to your component providing the same enum value
 */
@Component({
  selector: 'ds-advanced-claimed-task-action-abstract',
  template: ''
})
export abstract class AdvancedClaimedTaskActionsAbstractComponent extends ClaimedTaskActionsAbstractComponent implements OnInit {

  /**
   * The {@link WorkflowAction} id of the advanced workflow that needs to be opened.
   */
  abstract workflowType: string;

  /**
   * Route to the workflow's task page
   */
  workflowTaskPageRoute: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.initPageRoute();
  }

  /**
   * Initialise the route to the advanced workflow page
   */
  initPageRoute() {
    this.subs.push(this.object.workflowitem.pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((workflowItem: WorkflowItem) => {
      this.workflowTaskPageRoute = getAdvancedWorkflowRoute(workflowItem.id);
    }));
  }

  /**
   * Navigates to the advanced workflow page based on the {@link workflow}.
   */
  openAdvancedClaimedTaskTab(): void {
    void this.router.navigate([this.workflowTaskPageRoute], {
      queryParams: {
        workflow: this.workflowType,
        claimedTask: this.object.id,
      },
    });
  }

}
