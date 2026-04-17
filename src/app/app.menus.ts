/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { buildMenuStructure } from './shared/menu/menu.structure';
import { MenuID } from './shared/menu/menu-id.model';
import { MenuRoute } from './shared/menu/menu-route.model';
import { AccessControlMenuProvider } from './shared/menu/providers/access-control.menu';
import { AdminSearchMenuProvider } from './shared/menu/providers/admin-search.menu';
import { BrowseMenuProvider } from './shared/menu/providers/browse.menu';
import { CoarNotifyMenuProvider } from './shared/menu/providers/coar-notify.menu';
import { SubscribeMenuProvider } from './shared/menu/providers/comcol-subscribe.menu';
import { CommunityListMenuProvider } from './shared/menu/providers/community-list.menu';
import { CreateReportMenuProvider } from './shared/menu/providers/create-report.menu';
import { CurationMenuProvider } from './shared/menu/providers/curation.menu';
import { DSpaceObjectEditMenuProvider } from './shared/menu/providers/dso-edit.menu';
import { DsoOptionMenuProvider } from './shared/menu/providers/dso-option.menu';
import { EditMenuProvider } from './shared/menu/providers/edit.menu';
import { ExportMenuProvider } from './shared/menu/providers/export.menu';
import { HealthMenuProvider } from './shared/menu/providers/health.menu';
import { ImportMenuProvider } from './shared/menu/providers/import.menu';
import { ClaimMenuProvider } from './shared/menu/providers/item-claim.menu';
import { OrcidMenuProvider } from './shared/menu/providers/item-orcid.menu';
import { VersioningMenuProvider } from './shared/menu/providers/item-versioning.menu';
import { NewMenuProvider } from './shared/menu/providers/new.menu';
import { NotificationsMenuProvider } from './shared/menu/providers/notifications.menu';
import { ProcessesMenuProvider } from './shared/menu/providers/processes.menu';
import { RegistriesMenuProvider } from './shared/menu/providers/registries.menu';
import { StatisticsMenuProvider } from './shared/menu/providers/statistics.menu';
import { SystemWideAlertMenuProvider } from './shared/menu/providers/system-wide-alert.menu';
import { WithdrawnReinstateItemMenuProvider } from './shared/menu/providers/withdrawn-reinstate-item.menu';
import { WorkflowMenuProvider } from './shared/menu/providers/workflow.menu';

/**
 * Represents and builds the menu structure for the three available menus (public navbar, admin sidebar and the dso edit
 * menus).
 * The structure consists of a list of menu IDs with each of them having a list of providers that will create the
 * sections to be part of the menu matching the ID.
 *
 * The following menu groups are present in this structure:
 * - `MenuID.PUBLIC`: Defines menus accessible by the public in the navigation bar.
 * - `MenuID.ADMIN`: Defines menus for administrative users in the sidebar.
 * - `MenuID.DSO_EDIT`: Defines dynamic menu options for DSpace Objects that will be present on the DSpace Object's page.
 *
 * To add more menu sections to a menu (public navbar, admin sidebar or the dso edit menus),
 * a new provider can be added to the list with the corresponding menu ID.
 *
 * The configuration supports route-specific menu providers and hierarchically structured menu options.
 */
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
    NotificationsMenuProvider,
    AccessControlMenuProvider,
    AdminSearchMenuProvider,
    CreateReportMenuProvider,
    RegistriesMenuProvider,
    CurationMenuProvider,
    ProcessesMenuProvider,
    WorkflowMenuProvider,
    HealthMenuProvider,
    SystemWideAlertMenuProvider,
    CoarNotifyMenuProvider,
  ],
  [MenuID.DSO_EDIT]: [
    DsoOptionMenuProvider.withSubs([
      SubscribeMenuProvider.onRoute(
        MenuRoute.COMMUNITY_PAGE,
        MenuRoute.COLLECTION_PAGE,
      ),
      DSpaceObjectEditMenuProvider.onRoute(
        MenuRoute.COMMUNITY_PAGE,
        MenuRoute.COLLECTION_PAGE,
        MenuRoute.ITEM_PAGE,
      ),
      WithdrawnReinstateItemMenuProvider.onRoute(
        MenuRoute.ITEM_PAGE,
      ),
      VersioningMenuProvider.onRoute(
        MenuRoute.ITEM_PAGE,
      ),
      OrcidMenuProvider.onRoute(
        MenuRoute.ITEM_PAGE,
      ),
      ClaimMenuProvider.onRoute(
        MenuRoute.ITEM_PAGE,
      ),
    ]),
  ],
});
