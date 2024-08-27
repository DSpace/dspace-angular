import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { DsoContextBreadcrumbResolver } from '../core/breadcrumbs/dso-context-breadcrumb.resolver';
import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { EditItemRelationshipsResolver } from './edit-item-relationships.resolver';
import { EditItemRelationsGuard } from './guards/edit-item-relationships.guard';

export const ROUTES: Route[] = [
  {
    path: ':id/:type',
    component: EditItemRelationshipsComponent,
    resolve: {
      info: EditItemRelationshipsResolver,
      breadcrumb: DsoContextBreadcrumbResolver,
    },
    data: {
      breadcrumbKey: 'manage.relations',
    },
    canActivate: [authenticatedGuard, EditItemRelationsGuard],
    providers: [EditItemRelationshipsResolver],
  },
];
