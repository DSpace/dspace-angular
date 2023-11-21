import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';
import { EPERSON_PATH, GROUP_PATH } from './access-control-routing-paths';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { GroupPageGuard } from './group-registry/group-page.guard';
import {
  GroupAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/group-administrator.guard';
import {
  SiteAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { BulkAccessComponent } from './bulk-access/bulk-access.component';
import { EPersonFormComponent } from './epeople-registry/eperson-form/eperson-form.component';
import { EPersonResolver } from './epeople-registry/eperson-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: EPERSON_PATH,
        component: EPeopleRegistryComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.epeople.title', breadcrumbKey: 'admin.access-control.epeople' },
        canActivate: [SiteAdministratorGuard]
      },
      {
        path: `${EPERSON_PATH}/create`,
        component: EPersonFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: { title: 'admin.access-control.epeople.add.title', breadcrumbKey: 'admin.access-control.epeople.add' },
        canActivate: [SiteAdministratorGuard],
      },
      {
        path: `${EPERSON_PATH}/:id/edit`,
        component: EPersonFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          ePerson: EPersonResolver,
        },
        data: { title: 'admin.access-control.epeople.edit.title', breadcrumbKey: 'admin.access-control.epeople.edit' },
        canActivate: [SiteAdministratorGuard],
      },
      {
        path: GROUP_PATH,
        component: GroupsRegistryComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title', breadcrumbKey: 'admin.access-control.groups' },
        canActivate: [GroupAdministratorGuard]
      },
      {
        path: `${GROUP_PATH}/create`,
        component: GroupFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title.addGroup', breadcrumbKey: 'admin.access-control.groups.addGroup' },
        canActivate: [GroupAdministratorGuard]
      },
      {
        path: `${GROUP_PATH}/:groupId/edit`,
        component: GroupFormComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.groups.title.singleGroup', breadcrumbKey: 'admin.access-control.groups.singleGroup' },
        canActivate: [GroupPageGuard]
      },
      {
        path: 'bulk-access',
        component: BulkAccessComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'admin.access-control.bulk-access.title', breadcrumbKey: 'admin.access-control.bulk-access' },
        canActivate: [SiteAdministratorGuard]
      },
    ])
  ]
})
/**
 * Routing module for the AccessControl section of the admin sidebar
 */
export class AccessControlRoutingModule {

}
