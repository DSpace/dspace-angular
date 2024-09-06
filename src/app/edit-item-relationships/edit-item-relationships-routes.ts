import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { dsoContextBreadcrumbResolver } from '../core/breadcrumbs/dso-context-breadcrumb.resolver';
import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { editItemRelationshipsResolver } from './edit-item-relationships.resolver';
import { editItemRelationsGuard } from './guards/edit-item-relationships.guard';

export const ROUTES: Route[] = [
  {
    path: ':id/:type',
    component: EditItemRelationshipsComponent,
    resolve: {
      info: editItemRelationshipsResolver,
      breadcrumb: dsoContextBreadcrumbResolver,
    },
    data: {
      breadcrumbKey: 'manage.relations',
    },
    canActivate: [authenticatedGuard, editItemRelationsGuard],
  },
];
