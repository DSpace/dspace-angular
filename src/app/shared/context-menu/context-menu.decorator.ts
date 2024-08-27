import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { AuditItemMenuComponent } from './audit-item/audit-item-menu.component';
import { BulkImportMenuComponent } from './bulk-import/bulk-import-menu.component';
import { ClaimItemMenuComponent } from './claim-item/claim-item-menu.component';
import { ContextMenuEntryComponent } from './context-menu-entry.component';
import { DsoPageEditMenuComponent } from './dso-page-edit/dso-page-edit-menu.component';
import { EditItemMenuComponent } from './edit-item/edit-item-menu.component';
import { EditItemRelationshipsMenuComponent } from './edit-item-relationships/edit-item-relationships-menu.component';
import { ExportCollectionMenuComponent } from './export-collection/export-collection-menu.component';
import { ExportItemMenuComponent } from './export-item/export-item-menu.component';
import { FullItemMenuComponent } from './full-item/full-item-menu.component';
import { ItemVersionMenuComponent } from './item-version/item-version-menu.component';
import { OrcidViewPageMenuComponent } from './orcid-view-page/orcid-view-page-menu.component';
import { RequestCorrectionMenuComponent } from './request-correction/request-correction-menu.component';
import { StatisticsMenuComponent } from './statistics/statistics-menu.component';
import { SubscriptionMenuComponent } from './subscription/subscription-menu.component';

export interface ContextMenuEntryRenderOptions {
  componentRef: GenericConstructor<ContextMenuEntryComponent>;
  isStandAlone: boolean;
}

const contextMenuEntriesMap: Map<DSpaceObjectType, ContextMenuEntryRenderOptions[]> = new Map();

contextMenuEntriesMap.set(DSpaceObjectType.ITEM, [
  {
    componentRef: AuditItemMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: ClaimItemMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: DsoPageEditMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: EditItemMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: EditItemRelationshipsMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: FullItemMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: ItemVersionMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: OrcidViewPageMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: RequestCorrectionMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: ExportItemMenuComponent,
    isStandAlone: true,
  },
  {
    componentRef: StatisticsMenuComponent,
    isStandAlone: true,
  },
  {
    componentRef: SubscriptionMenuComponent,
    isStandAlone: true,
  },
]);
contextMenuEntriesMap.set(DSpaceObjectType.COMMUNITY, [
  {
    componentRef: DsoPageEditMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: StatisticsMenuComponent,
    isStandAlone: true,
  },
  {
    componentRef: SubscriptionMenuComponent,
    isStandAlone: true,
  },
]);
contextMenuEntriesMap.set(DSpaceObjectType.COLLECTION, [
  {
    componentRef: BulkImportMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: DsoPageEditMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: ExportCollectionMenuComponent,
    isStandAlone: false,
  },
  {
    componentRef: StatisticsMenuComponent,
    isStandAlone: true,
  },
  {
    componentRef: SubscriptionMenuComponent,
    isStandAlone: true,
  },
]);

/**
 * Decorator function to link a DSpaceObjectType to a list of context menu entries components
 * @param {DSpaceObjectType} type The DSpaceObjectType
 * @param {boolean} isStandAlone  Represent if menu is a stand alone button
 */
export function rendersContextMenuEntriesForType(type: DSpaceObjectType, isStandAlone: boolean = false) {
  return function decorator(entryComponent: any) {
    if (!entryComponent) {
      return;
    }
    let entryList: any[];
    const renderOptions: ContextMenuEntryRenderOptions = {
      componentRef: entryComponent,
      isStandAlone,
    };
    if (contextMenuEntriesMap.has(type)) {
      entryList = [...contextMenuEntriesMap.get(type), renderOptions];
    } else {
      entryList = [renderOptions];
    }
    contextMenuEntriesMap.set(type, entryList);
  };
}

/**
 * Retrieves the list of Component matching a given DSpaceObjectType
 * @param {DSpaceObjectType} type The given DSpaceObjectType
 * @returns {GenericConstructor} The list of constructor of the Components that matches the DSpaceObjectType
 */
export function getContextMenuEntriesForDSOType(type: DSpaceObjectType): ContextMenuEntryRenderOptions[] {
  return contextMenuEntriesMap.get(type);
}
