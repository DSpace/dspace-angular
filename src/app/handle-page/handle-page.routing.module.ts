import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { HandlePageComponent } from './handle-page.component';
import {
  GLOBAL_ACTIONS_PATH,
  HANDLE_TABLE_EDIT_HANDLE_PATH,
  HANDLE_TABLE_NEW_HANDLE_PATH
} from './handle-page-routing-paths';
import { NewHandlePageComponent } from './new-handle-page/new-handle-page.component';
import { EditHandlePageComponent } from './edit-handle-page/edit-handle-page.component';
import { ChangeHandlePrefixPageComponent } from './change-handle-prefix-page/change-handle-prefix-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'handle-table',
        },
        component: HandlePageComponent,
        pathMatch: 'full'
      },
      {
        path: HANDLE_TABLE_NEW_HANDLE_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'handle-table.new-handle',
        },
        component: NewHandlePageComponent,
      },
      {
        path: HANDLE_TABLE_EDIT_HANDLE_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'handle-table.edit-handle',
        },
        component: EditHandlePageComponent,
      },
      {
        path: GLOBAL_ACTIONS_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {
          breadcrumbKey: 'handle-table.global-actions',
        },
        component: ChangeHandlePrefixPageComponent,
      },
    ])
  ]
})
export class HandlePageRoutingModule {

}
