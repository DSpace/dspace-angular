import { Routes } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedFullItemPageComponent } from '../item-page/full/themed-full-item-page.component';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { AdvancedWorkflowActionPageComponent } from './advanced-workflow-action/advanced-workflow-action-page/advanced-workflow-action-page.component';
import { itemFromWorkflowResolver } from './item-from-workflow.resolver';
import { ItemFromWorkflowBreadcrumbResolver } from './item-from-workflow-breadcrumb.resolver';
import { ThemedWorkflowItemDeleteComponent } from './workflow-item-delete/themed-workflow-item-delete.component';
import { workflowItemPageResolver } from './workflow-item-page.resolver';
import { ThemedWorkflowItemSendBackComponent } from './workflow-item-send-back/themed-workflow-item-send-back.component';
import {
  ADVANCED_WORKFLOW_PATH,
  WORKFLOW_ITEM_DELETE_PATH,
  WORKFLOW_ITEM_EDIT_PATH,
  WORKFLOW_ITEM_SEND_BACK_PATH,
  WORKFLOW_ITEM_VIEW_PATH,
} from './workflowitems-edit-page-routing-paths';

export const ROUTES: Routes = [
  {
    path: ':id',
    resolve: {
      breadcrumb: ItemFromWorkflowBreadcrumbResolver,
      wfi: workflowItemPageResolver,
    },
    children: [
      {
        canActivate: [authenticatedGuard],
        path: WORKFLOW_ITEM_EDIT_PATH,
        component: ThemedSubmissionEditComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: {
          title: 'workflow-item.edit.title',
          breadcrumbKey: 'workflow-item.edit',
          collectionModifiable: false,
        },
      },
      {
        canActivate: [authenticatedGuard],
        path: WORKFLOW_ITEM_VIEW_PATH,
        component: ThemedFullItemPageComponent,
        resolve: {
          dso: itemFromWorkflowResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workflow-item.view.title', breadcrumbKey: 'workflow-item.view' },
      },
      {
        canActivate: [authenticatedGuard],
        path: WORKFLOW_ITEM_DELETE_PATH,
        component: ThemedWorkflowItemDeleteComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workflow-item.delete.title', breadcrumbKey: 'workflow-item.edit' },
      },
      {
        canActivate: [authenticatedGuard],
        path: WORKFLOW_ITEM_SEND_BACK_PATH,
        component: ThemedWorkflowItemSendBackComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workflow-item.send-back.title', breadcrumbKey: 'workflow-item.edit' },
      },
      {
        canActivate: [authenticatedGuard],
        path: ADVANCED_WORKFLOW_PATH,
        component: AdvancedWorkflowActionPageComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workflow-item.advanced.title', breadcrumbKey: 'workflow-item.edit' },
      },
    ],
  },
];
