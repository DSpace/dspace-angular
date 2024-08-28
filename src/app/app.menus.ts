/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { MenuID } from './shared/menu/menu-id.model';
import { buildMenuStructure } from './shared/menu/menu.structure';
import { AccessControlMenuProvider } from './shared/menu/providers/access-control.menu';
import { AdminSearchMenuProvider } from './shared/menu/providers/admin-search.menu';
import { BrowseMenuProvider } from './shared/menu/providers/browse.menu';
import { SubscribeMenuProvider } from './shared/menu/providers/comcol-subscribe.menu';
import { CommunityListMenuProvider } from './shared/menu/providers/community-list.menu';
import { CurationMenuProvider } from './shared/menu/providers/curation.menu';
import { DSpaceObjectEditMenuProvider } from './shared/menu/providers/dso-edit.menu';
import { EditMenuProvider } from './shared/menu/providers/edit.menu';
import { ExportMenuProvider } from './shared/menu/providers/export.menu';
import { HealthMenuProvider } from './shared/menu/providers/health.menu';
import { ImportMenuProvider } from './shared/menu/providers/import.menu';
import { ClaimMenuProvider } from './shared/menu/providers/item-claim.menu';
import { OrcidMenuProvider } from './shared/menu/providers/item-orcid.menu';
import { VersioningMenuProvider } from './shared/menu/providers/item-versioning.menu';
import { NewMenuProvider } from './shared/menu/providers/new.menu';
import { ProcessesMenuProvider } from './shared/menu/providers/processes.menu';
import { RegistriesMenuProvider } from './shared/menu/providers/registries.menu';
import { StatisticsMenuProvider } from './shared/menu/providers/statistics.menu';
import { SystemWideAlertMenuProvider } from './shared/menu/providers/system-wide-alert.menu';
import { WorkflowMenuProvider } from './shared/menu/providers/workflow.menu';
import { COMMUNITY_MODULE_PATH } from './community-page/community-page-routing-paths';
import { COLLECTION_MODULE_PATH } from './collection-page/collection-page-routing-paths';
import { ENTITY_MODULE_PATH, ITEM_MODULE_PATH } from './item-page/item-page-routing-paths';
import { HOME_PAGE_PATH } from './app-routing-paths';

export const MENUS = buildMenuStructure({
  [MenuID.PUBLIC]: [
    CommunityListMenuProvider,
    BrowseMenuProvider,
    StatisticsMenuProvider,
  ],
  [MenuID.ADMIN]: [
    NewMenuProvider,
    EditMenuProvider,
    ImportMenuProvider,
    ExportMenuProvider,
    AccessControlMenuProvider,
    AdminSearchMenuProvider,
    RegistriesMenuProvider,
    CurationMenuProvider,
    ProcessesMenuProvider,
    WorkflowMenuProvider,
    HealthMenuProvider,
    SystemWideAlertMenuProvider,
  ],
  [MenuID.DSO_EDIT]: [
    DSpaceObjectEditMenuProvider.onRoute(COMMUNITY_MODULE_PATH, COLLECTION_MODULE_PATH, ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
    VersioningMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
    OrcidMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
    ClaimMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
    SubscribeMenuProvider.onRoute(COMMUNITY_MODULE_PATH, COLLECTION_MODULE_PATH),
  ],
});
