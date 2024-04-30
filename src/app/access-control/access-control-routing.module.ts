import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';
import { GROUP_EDIT_PATH } from './access-control-routing-paths';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { BulkAccessComponent } from './bulk-access/bulk-access.component';
import {
  siteAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  groupAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/group-administrator.guard';
import { groupPageGuard } from './group-registry/group-page.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'epeople',
        component: EPeopleRegistryComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.epeople.title', breadcrumbKey: 'admin.access-control.epeople' },
        canActivate: [siteAdministratorGuard]
      },
      {
        path: GROUP_EDIT_PATH,
        component: GroupsRegistryComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title', breadcrumbKey: 'admin.access-control.groups' },
        canActivate: [groupAdministratorGuard]
      },
      {
        path: `${GROUP_EDIT_PATH}/newGroup`,
        component: GroupFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title.addGroup', breadcrumbKey: 'admin.access-control.groups.addGroup' },
        canActivate: [groupAdministratorGuard]
      },
      {
        path: `${GROUP_EDIT_PATH}/:groupId`,
        component: GroupFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title.singleGroup', breadcrumbKey: 'admin.access-control.groups.singleGroup' },
        canActivate: [groupPageGuard]
      },
      {
        path: 'bulk-access',
        component: BulkAccessComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.bulk-access.title', breadcrumbKey: 'admin.access-control.bulk-access' },
        canActivate: [siteAdministratorGuard]
      },
    ])
  ]
})
/**
 * Routing module for the AccessControl section of the admin sidebar
 */
export class AccessControlRoutingModule {

}
