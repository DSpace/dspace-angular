import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { collectionAdministratorGuard } from '../../core/data/feature-authorization/feature-authorization-guard/collection-administrator.guard';
import { ResourcePolicyCreateComponent } from '../../shared/resource-policies/create/resource-policy-create.component';
import { ResourcePolicyEditComponent } from '../../shared/resource-policies/edit/resource-policy-edit.component';
import { resourcePolicyResolver } from '../../shared/resource-policies/resolvers/resource-policy.resolver';
import { resourcePolicyTargetResolver } from '../../shared/resource-policies/resolvers/resource-policy-target.resolver';
import { CollectionItemMapperComponent } from '../collection-item-mapper/collection-item-mapper.component';
import { CollectionAccessControlComponent } from './collection-access-control/collection-access-control.component';
import { CollectionAuthorizationsComponent } from './collection-authorizations/collection-authorizations.component';
import { CollectionCurateComponent } from './collection-curate/collection-curate.component';
import { CollectionMetadataComponent } from './collection-metadata/collection-metadata.component';
import { CollectionRolesComponent } from './collection-roles/collection-roles.component';
import { CollectionSourceComponent } from './collection-source/collection-source.component';
import { EditCollectionPageComponent } from './edit-collection-page.component';

/**
 * Routing module that handles the routing for the Edit Collection page administrator functionality
 */

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { breadcrumbKey: 'collection.edit' },
    component: EditCollectionPageComponent,
    canActivate: [collectionAdministratorGuard],
    children: [
      {
        path: '',
        redirectTo: 'metadata',
        pathMatch: 'full',
      },
      {
        path: 'metadata',
        component: CollectionMetadataComponent,
        data: {
          title: 'collection.edit.tabs.metadata.title',
          hideReturnButton: true,
          showBreadcrumbs: true,
        },
      },
      {
        path: 'roles',
        component: CollectionRolesComponent,
        data: { title: 'collection.edit.tabs.roles.title', showBreadcrumbs: true },
      },
      {
        path: 'source',
        component: CollectionSourceComponent,
        data: { title: 'collection.edit.tabs.source.title', showBreadcrumbs: true },
      },
      {
        path: 'curate',
        component: CollectionCurateComponent,
        data: { title: 'collection.edit.tabs.curate.title', showBreadcrumbs: true },
      },
      {
        path: 'access-control',
        component: CollectionAccessControlComponent,
        data: { title: 'collection.edit.tabs.access-control.title', showBreadcrumbs: true },
      },
      {
        path: 'authorizations',
        data: { showBreadcrumbs: true },
        children: [
          {
            path: 'create',
            resolve: {
              resourcePolicyTarget: resourcePolicyTargetResolver,
            },
            component: ResourcePolicyCreateComponent,
            data: { title: 'resource-policies.create.page.title' },
          },
          {
            path: 'edit',
            resolve: {
              resourcePolicy: resourcePolicyResolver,
            },
            component: ResourcePolicyEditComponent,
            data: { title: 'resource-policies.edit.page.title' },
          },
          {
            path: '',
            component: CollectionAuthorizationsComponent,
            data: { title: 'collection.edit.tabs.authorizations.title', showBreadcrumbs: true },
          },
        ],
      },
      {
        path: 'mapper',
        component: CollectionItemMapperComponent,
        data: { title: 'collection.edit.tabs.item-mapper.title', hideReturnButton: true, showBreadcrumbs: true },
      },
    ],
  },
];
