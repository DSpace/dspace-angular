import { AbstractControl } from '@angular/forms';
import {
  mapToCanActivate,
  Route,
} from '@angular/router';
import {
  DYNAMIC_ERROR_MESSAGES_MATCHER,
  DynamicErrorMessagesMatcher,
} from '@ng-dynamic-forms/core';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { GroupAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/group-administrator.guard';
import { SiteAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  EPERSON_PATH,
  GROUP_PATH,
} from './access-control-routing-paths';
import { BulkAccessComponent } from './bulk-access/bulk-access.component';
import { EPeopleRegistryComponent } from './epeople-registry/epeople-registry.component';
import { EPersonFormComponent } from './epeople-registry/eperson-form/eperson-form.component';
import { EPersonResolver } from './epeople-registry/eperson-resolver.service';
import { GroupFormComponent } from './group-registry/group-form/group-form.component';
import { GroupPageGuard } from './group-registry/group-page.guard';
import { GroupsRegistryComponent } from './group-registry/groups-registry.component';

/**
 * Condition for displaying error messages on email form field
 */
export const ValidateEmailErrorStateMatcher: DynamicErrorMessagesMatcher =
  (control: AbstractControl, model: any, hasFocus: boolean) => {
    return (control.touched && !hasFocus) || (control.errors?.emailTaken && hasFocus);
  };

const providers = [
  {
    provide: DYNAMIC_ERROR_MESSAGES_MATCHER,
    useValue: ValidateEmailErrorStateMatcher,
  },
];
export const ROUTES: Route[] = [
  {
    path: EPERSON_PATH,
    component: EPeopleRegistryComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    providers,
    data: { title: 'admin.access-control.epeople.title', breadcrumbKey: 'admin.access-control.epeople' },
    canActivate: mapToCanActivate([SiteAdministratorGuard]),
  },
  {
    path: `${EPERSON_PATH}/create`,
    component: EPersonFormComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    providers,
    data: { title: 'admin.access-control.epeople.add.title', breadcrumbKey: 'admin.access-control.epeople.add' },
    canActivate: mapToCanActivate([SiteAdministratorGuard]),
  },
  {
    path: `${EPERSON_PATH}/:id/edit`,
    component: EPersonFormComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
      ePerson: EPersonResolver,
    },
    providers,
    data: { title: 'admin.access-control.epeople.edit.title', breadcrumbKey: 'admin.access-control.epeople.edit' },
    canActivate: mapToCanActivate([SiteAdministratorGuard]),
  },
  {
    path: GROUP_PATH,
    component: GroupsRegistryComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    providers,
    data: { title: 'admin.access-control.groups.title', breadcrumbKey: 'admin.access-control.groups' },
    canActivate: mapToCanActivate([GroupAdministratorGuard]),
  },
  {
    path: `${GROUP_PATH}/create`,
    component: GroupFormComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    providers,
    data: {
      title: 'admin.access-control.groups.title.addGroup',
      breadcrumbKey: 'admin.access-control.groups.addGroup',
    },
    canActivate: mapToCanActivate([GroupAdministratorGuard]),
  },
  {
    path: `${GROUP_PATH}/:groupId/edit`,
    component: GroupFormComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    providers,
    data: {
      title: 'admin.access-control.groups.title.singleGroup',
      breadcrumbKey: 'admin.access-control.groups.singleGroup',
    },
    canActivate: mapToCanActivate([GroupPageGuard]),
  },
  {
    path: 'bulk-access',
    component: BulkAccessComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'admin.access-control.bulk-access.title', breadcrumbKey: 'admin.access-control.bulk-access' },
    canActivate: mapToCanActivate([SiteAdministratorGuard]),
  },
];
