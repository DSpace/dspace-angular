import { Component } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';

@listableObjectComponent(WorkflowItem, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-workflow-item-admin-workflow-list-element',
  styleUrls: ['./workflow-item-admin-workflow-list-element.component.scss'],
  templateUrl: './workflow-item-admin-workflow-list-element.component.html'
})
/**
 * The component for displaying a list element for an workflow item on the admin search page
 */
export class WorkflowItemAdminWorkflowListElementComponent extends AbstractListableElementComponent<WorkflowItem> {

}
