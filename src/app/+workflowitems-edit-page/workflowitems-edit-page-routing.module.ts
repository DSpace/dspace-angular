import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';
import { WorkflowItemDeleteComponent } from './workflow-item-delete/workflow-item-delete.component';
import { WorkflowItemPageResolver } from './workflow-item-page.resolver';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back/workflow-item-send-back.component';
import {
  WORKFLOW_ITEM_SEND_BACK_PATH,
  WORKFLOW_ITEM_DELETE_PATH,
  WORKFLOW_ITEM_EDIT_PATH
} from './workflowitems-edit-page-routing-paths';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        resolve: { wfi: WorkflowItemPageResolver },
        children: [
          {
            canActivate: [AuthenticatedGuard],
            path: WORKFLOW_ITEM_EDIT_PATH,
            component: SubmissionEditComponent,
            data: { title: 'submission.edit.title' }
          },
          {
            canActivate: [AuthenticatedGuard],
            path: WORKFLOW_ITEM_DELETE_PATH,
            component: WorkflowItemDeleteComponent,
            data: { title: 'workflow-item.delete.title' }
          },
          {
            canActivate: [AuthenticatedGuard],
            path: WORKFLOW_ITEM_SEND_BACK_PATH,
            component: WorkflowItemSendBackComponent,
            data: { title: 'workflow-item.send-back.title' }
          }
        ]
      }]
    )
  ],
  providers: [WorkflowItemPageResolver]
})
/**
 * This module defines the default component to load when navigating to the workflowitems edit page path.
 */
export class WorkflowItemsEditPageRoutingModule {
}
