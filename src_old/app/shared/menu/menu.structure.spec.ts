import { buildMenuStructure } from './menu.structure';
import { MenuID } from './menu-id.model';
import { MenuRoute } from './menu-route.model';
import { AccessControlMenuProvider } from './providers/access-control.menu';
import { AdminSearchMenuProvider } from './providers/admin-search.menu';
import { BrowseMenuProvider } from './providers/browse.menu';
import { SubscribeMenuProvider } from './providers/comcol-subscribe.menu';
import { CommunityListMenuProvider } from './providers/community-list.menu';
import { CurationMenuProvider } from './providers/curation.menu';
import { DSpaceObjectEditMenuProvider } from './providers/dso-edit.menu';
import { DsoOptionMenuProvider } from './providers/dso-option.menu';
import { EditMenuProvider } from './providers/edit.menu';
import { ExportMenuProvider } from './providers/export.menu';
import { HealthMenuProvider } from './providers/health.menu';
import { ImportMenuProvider } from './providers/import.menu';
import { ClaimMenuProvider } from './providers/item-claim.menu';
import { OrcidMenuProvider } from './providers/item-orcid.menu';
import { VersioningMenuProvider } from './providers/item-versioning.menu';
import { NewMenuProvider } from './providers/new.menu';
import { ProcessesMenuProvider } from './providers/processes.menu';
import { RegistriesMenuProvider } from './providers/registries.menu';
import { StatisticsMenuProvider } from './providers/statistics.menu';
import { SystemWideAlertMenuProvider } from './providers/system-wide-alert.menu';
import { WorkflowMenuProvider } from './providers/workflow.menu';

describe('buildMenuStructure', () => {
  const providerStructure =
    {
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
          VersioningMenuProvider.onRoute(
            MenuRoute.ITEM_PAGE,
          ),
          OrcidMenuProvider.onRoute(
            MenuRoute.ITEM_PAGE,
          ),
          ClaimMenuProvider.onRoute(
            MenuRoute.ITEM_PAGE,
            MenuRoute.COLLECTION_PAGE,
          ),
        ]),
      ],
    };

  const orderedProviderTypeList =
    [
      CommunityListMenuProvider,
      BrowseMenuProvider,
      StatisticsMenuProvider,
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
      SubscribeMenuProvider,
      DSpaceObjectEditMenuProvider,
      VersioningMenuProvider,
      OrcidMenuProvider,
      ClaimMenuProvider,
      DsoOptionMenuProvider,
    ];


  it('should have a double amount of objects after the processing', () => {
    const result = buildMenuStructure(providerStructure);
    expect(result.length).toEqual(orderedProviderTypeList.length * 2);
  });

  it('should return a list with a resolved provider and provider type for each provider in the provided structure', () => {
    const result = buildMenuStructure(providerStructure);

    orderedProviderTypeList.forEach((provider, index) => {
      expect((result[index * 2] as any).deps).toEqual([provider]);
      expect(result[index * 2 + 1]).toEqual(provider);
    });
  });
});
