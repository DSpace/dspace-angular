import { MenuID } from './menu-id.model';
import { CommunityListMenuProvider } from './providers/community-list.menu';
import { NewMenuProvider } from './providers/new.menu';
import { DsoOptionMenu } from './providers/dso-option.menu';
import { SubscribeMenuProvider } from './providers/comcol-subscribe.menu';
import { COMMUNITY_MODULE_PATH } from '../../community-page/community-page-routing-paths';
import { COLLECTION_MODULE_PATH } from '../../collection-page/collection-page-routing-paths';
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
import { ENTITY_MODULE_PATH, ITEM_MODULE_PATH } from '../../item-page/item-page-routing-paths';
import { VersioningMenuProvider } from './providers/item-versioning.menu';
import { OrcidMenuProvider } from './providers/item-orcid.menu';
import { ClaimMenuProvider } from './providers/item-claim.menu';

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
        DsoOptionMenu.withSubs([
          SubscribeMenuProvider.onRoute(COMMUNITY_MODULE_PATH, COLLECTION_MODULE_PATH),
          DSpaceObjectEditMenuProvider.onRoute(COMMUNITY_MODULE_PATH, COLLECTION_MODULE_PATH, ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
          VersioningMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
          OrcidMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH),
          ClaimMenuProvider.onRoute(ITEM_MODULE_PATH, ENTITY_MODULE_PATH, COLLECTION_MODULE_PATH),
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
      DsoOptionMenu,
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
