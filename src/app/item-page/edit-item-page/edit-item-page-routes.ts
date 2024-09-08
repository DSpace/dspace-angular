import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedDsoEditMetadataComponent } from '../../dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { ResourcePolicyCreateComponent } from '../../shared/resource-policies/create/resource-policy-create.component';
import { ResourcePolicyEditComponent } from '../../shared/resource-policies/edit/resource-policy-edit.component';
import { resourcePolicyResolver } from '../../shared/resource-policies/resolvers/resource-policy.resolver';
import { resourcePolicyTargetResolver } from '../../shared/resource-policies/resolvers/resource-policy-target.resolver';
import { EditItemPageComponent } from './edit-item-page.component';
import {
  ITEM_EDIT_AUTHORIZATIONS_PATH,
  ITEM_EDIT_DELETE_PATH,
  ITEM_EDIT_MOVE_PATH,
  ITEM_EDIT_PRIVATE_PATH,
  ITEM_EDIT_PUBLIC_PATH,
  ITEM_EDIT_REGISTER_DOI_PATH,
  ITEM_EDIT_REINSTATE_PATH,
  ITEM_EDIT_WITHDRAW_PATH,
} from './edit-item-page.routing-paths';
import { ItemAccessControlComponent } from './item-access-control/item-access-control.component';
import { ItemAuthorizationsComponent } from './item-authorizations/item-authorizations.component';
import { ItemBitstreamsComponent } from './item-bitstreams/item-bitstreams.component';
import { ItemCollectionMapperComponent } from './item-collection-mapper/item-collection-mapper.component';
import { ItemCurateComponent } from './item-curate/item-curate.component';
import { ItemDeleteComponent } from './item-delete/item-delete.component';
import { ItemMoveComponent } from './item-move/item-move.component';
import { itemPageAccessControlGuard } from './item-page-access-control.guard';
import { itemPageBitstreamsGuard } from './item-page-bitstreams.guard';
import { itemPageCollectionMapperGuard } from './item-page-collection-mapper.guard';
import { itemPageCurateGuard } from './item-page-curate.guard';
import { itemPageDeleteGuard } from './item-page-delete.guard';
import { itemPageEditAuthorizationsGuard } from './item-page-edit-authorizations.guard';
import { itemPageMetadataGuard } from './item-page-metadata.guard';
import { itemPageMoveGuard } from './item-page-move.guard';
import { itemPagePrivateGuard } from './item-page-private.guard';
import { itemPageRegisterDoiGuard } from './item-page-register-doi.guard';
import { itemPageReinstateGuard } from './item-page-reinstate.guard';
import { itemPageRelationshipsGuard } from './item-page-relationships.guard';
import { itemPageStatusGuard } from './item-page-status.guard';
import { itemPageVersionHistoryGuard } from './item-page-version-history.guard';
import { itemPageWithdrawGuard } from './item-page-withdraw.guard';
import { ItemPrivateComponent } from './item-private/item-private.component';
import { ItemPublicComponent } from './item-public/item-public.component';
import { ItemRegisterDoiComponent } from './item-register-doi/item-register-doi.component';
import { ItemReinstateComponent } from './item-reinstate/item-reinstate.component';
import { ItemRelationshipsComponent } from './item-relationships/item-relationships.component';
import { ThemedItemStatusComponent } from './item-status/themed-item-status.component';
import { ItemVersionHistoryComponent } from './item-version-history/item-version-history.component';
import { ItemWithdrawComponent } from './item-withdraw/item-withdraw.component';

/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { breadcrumbKey: 'item.edit' },
    children: [
      {
        path: '',
        component: EditItemPageComponent,
        children: [
          {
            path: '',
            redirectTo: 'status',
            pathMatch: 'full',
          },
          {
            path: 'status',
            component: ThemedItemStatusComponent,
            data: { title: 'item.edit.tabs.status.title', showBreadcrumbs: true },
            canActivate: [itemPageStatusGuard],
          },
          {
            path: 'bitstreams',
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.bitstreams.title', showBreadcrumbs: true },
            canActivate: [itemPageBitstreamsGuard],
          },
          {
            path: 'metadata',
            component: ThemedDsoEditMetadataComponent,
            data: { title: 'item.edit.tabs.metadata.title', showBreadcrumbs: true },
            canActivate: [itemPageMetadataGuard],
          },
          {
            path: 'curate',
            component: ItemCurateComponent,
            data: { title: 'item.edit.tabs.curate.title', showBreadcrumbs: true },
            canActivate: [itemPageCurateGuard],
          },
          {
            path: 'relationships',
            component: ItemRelationshipsComponent,
            data: { title: 'item.edit.tabs.relationships.title', showBreadcrumbs: true },
            canActivate: [itemPageRelationshipsGuard],
          },
          /* TODO - uncomment & fix when view page exists
          {
            path: 'view',
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.view.title', showBreadcrumbs: true }
          }, */
          /* TODO - uncomment & fix when curate page exists
          {
            path: 'curate',
            component: ItemBitstreamsComponent,
            data: { title: 'item.edit.tabs.curate.title', showBreadcrumbs: true }
          }, */
          {
            path: 'versionhistory',
            component: ItemVersionHistoryComponent,
            data: { title: 'item.edit.tabs.versionhistory.title', showBreadcrumbs: true },
            canActivate: [itemPageVersionHistoryGuard],
          },
          {
            path: 'access-control',
            component: ItemAccessControlComponent,
            data: { title: 'item.edit.tabs.access-control.title', showBreadcrumbs: true },
            canActivate: [itemPageAccessControlGuard],
          },
          {
            path: 'mapper',
            component: ItemCollectionMapperComponent,
            data: { title: 'item.edit.tabs.item-mapper.title', showBreadcrumbs: true },
            canActivate: [itemPageCollectionMapperGuard],
          },
        ],
      },
      {
        path: 'mapper',
        component: ItemCollectionMapperComponent,
      },
      {
        path: ITEM_EDIT_WITHDRAW_PATH,
        component: ItemWithdrawComponent,
        canActivate: [itemPageWithdrawGuard],
      },
      {
        path: ITEM_EDIT_REINSTATE_PATH,
        component: ItemReinstateComponent,
        canActivate: [itemPageReinstateGuard],
      },
      {
        path: ITEM_EDIT_PRIVATE_PATH,
        component: ItemPrivateComponent,
        canActivate: [itemPagePrivateGuard],
      },
      {
        path: ITEM_EDIT_PUBLIC_PATH,
        component: ItemPublicComponent,
      },
      {
        path: ITEM_EDIT_DELETE_PATH,
        component: ItemDeleteComponent,
        canActivate: [itemPageDeleteGuard],
      },
      {
        path: ITEM_EDIT_MOVE_PATH,
        component: ItemMoveComponent,
        data: { title: 'item.edit.move.title' },
        canActivate: [itemPageMoveGuard],
      },
      {
        path: ITEM_EDIT_REGISTER_DOI_PATH,
        component: ItemRegisterDoiComponent,
        canActivate: [itemPageRegisterDoiGuard],
        data: { title: 'item.edit.register-doi.title' },
      },
      {
        path: ITEM_EDIT_AUTHORIZATIONS_PATH,
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
            component: ItemAuthorizationsComponent,
            data: { title: 'item.edit.authorizations.title' },
          },
        ],
        canActivate: [itemPageEditAuthorizationsGuard],
      },
    ],
  },
];
