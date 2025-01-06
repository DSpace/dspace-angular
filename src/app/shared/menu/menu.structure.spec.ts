import { MenuID } from './menu-id.model';
import { CommunityListMenuProvider } from './providers/community-list.menu';
import { NewMenuProvider } from './providers/new.menu';
import { DsoOptionMenuProvider } from './providers/dso-option.menu';
import { SubscribeMenuProvider } from './providers/comcol-subscribe.menu';
import { buildMenuStructure } from './menu.structure';
import { MenuProviderService } from './menu-provider.service';
import { BrowseMenuProvider } from './providers/browse.menu';
import { StatisticsMenuProvider } from './providers/statistics.menu';
import { EditMenuProvider } from './providers/edit.menu';
import { ImportMenuProvider } from './providers/import.menu';
import { ExportMenuProvider } from './providers/export.menu';
import { AccessControlMenuProvider } from './providers/access-control.menu';
import { AdminSearchMenuProvider } from './providers/admin-search.menu';
import { RegistriesMenuProvider } from './providers/registries.menu';
import { CurationMenuProvider } from './providers/curation.menu';
import { ProcessesMenuProvider } from './providers/processes.menu';
import { WorkflowMenuProvider } from './providers/workflow.menu';
import { HealthMenuProvider } from './providers/health.menu';
import { SystemWideAlertMenuProvider } from './providers/system-wide-alert.menu';
import { DSpaceObjectEditMenuProvider } from './providers/dso-edit.menu';
import { VersioningMenuProvider } from './providers/item-versioning.menu';
import { OrcidMenuProvider } from './providers/item-orcid.menu';
import { ClaimMenuProvider } from './providers/item-claim.menu';
import { MenuRoute } from './menu-route.model';

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
            MenuRoute.SIMPLE_COMMUNITY_PAGE,
            MenuRoute.SIMPLE_COLLECTION_PAGE
          ),
          DSpaceObjectEditMenuProvider.onRoute(
            MenuRoute.SIMPLE_COMMUNITY_PAGE,
            MenuRoute.SIMPLE_COLLECTION_PAGE,
            MenuRoute.SIMPLE_ITEM_PAGE,
            MenuRoute.FULL_ITEM_PAGE,
          ),
          VersioningMenuProvider.onRoute(
            MenuRoute.SIMPLE_ITEM_PAGE,
            MenuRoute.FULL_ITEM_PAGE,
          ),
          OrcidMenuProvider.onRoute(
            MenuRoute.SIMPLE_ITEM_PAGE,
            MenuRoute.FULL_ITEM_PAGE,
          ),
          ClaimMenuProvider.onRoute(
            MenuRoute.SIMPLE_ITEM_PAGE,
            MenuRoute.FULL_ITEM_PAGE,
            MenuRoute.SIMPLE_COLLECTION_PAGE,
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


  it('should have a double amount of objects with an additional service after the processing', () => {
    const result = buildMenuStructure(providerStructure);
    expect(result.length).toEqual(orderedProviderTypeList.length * 2 + 1);
  });

  it('should return a list with the MenuProviderService and then a resolved provider and provider type for each provider in the provided structure', () => {
    const result = buildMenuStructure(providerStructure);
    expect(result[0]).toEqual(MenuProviderService);

    orderedProviderTypeList.forEach((provider, index) => {
      expect((result[(index + 1) * 2 - 1] as any).deps).toEqual([provider]);
      expect(result[(index + 1) * 2]).toEqual(provider);
    });
  });
});
