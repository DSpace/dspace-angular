import { Injectable } from '@angular/core';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService,
} from '@dspace/core/itemexportformat/item-export-format.service';
import { ItemExportFormat } from '@dspace/core/itemexportformat/model/item-export-format.model';
import { Item } from '@dspace/core/shared/item.model';
import { SearchOptions } from '@dspace/core/shared/search/models/search-options.model';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

/**
 * Configuration for the item export form, including available entity types and formats.
 */
export interface ItemExportFormConfiguration {
  entityType: string;
  format: ItemExportFormat;

  entityTypes: string[];
  formats: ItemExportFormat[];
}

/**
 * Service responsible for managing item export operations.
 * Provides methods to initialize export form configurations, handle entity type changes,
 * and submit export requests for single or multiple items.
 */
@Injectable({
  providedIn: 'root',
})
export class ItemExportService {

  constructor(private itemExportFormatService: ItemExportFormatService) {
  }

  /**
   * Initialize the item export form configuration.
   * @param item
   */
  public initialItemExportFormConfiguration(item: Item): Observable<ItemExportFormConfiguration> {
    if (item) {
      return this.initialItemExportFormConfigurationSingle(item);
    }
    return this.initialItemExportFormConfigurationMultiple();
  }

  /**
   * A new item export form configuration when a specific entityType is selected.
   * @param entityTypes
   * @param entityType
   */
  public onSelectEntityType(entityTypes: string[], entityType): Observable<ItemExportFormConfiguration> {
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(entityType, ItemExportFormatMolteplicity.MULTIPLE).pipe(
      take(1),
      map(values => this.buildConfiguration(entityTypes, entityType, values[entityType])),
    );
  }

  /**
   * Perform the export operation.
   * @param molteplicity
   * @param item
   * @param searchOptions
   * @param entityType
   * @param format
   * @param itemList
   */
  public submitForm(
    molteplicity: ItemExportFormatMolteplicity,
    item: Item,
    searchOptions: SearchOptions,
    entityType: string,
    format: ItemExportFormat,
    itemList: string[] = [],
  ): Observable<number> {
    if (molteplicity === ItemExportFormatMolteplicity.SINGLE) {
      return this.itemExportFormatService.doExport(item.uuid, format);
    } else {
      return this.itemExportFormatService.doExportMulti(entityType, format, searchOptions, itemList);
    }
  }

  /**
   * Initialize export form configuration for a single item export.
   * Resolves export formats based on the item's entity type.
   * @param item - The item to export
   * @returns Observable emitting the form configuration for single-item export
   */
  protected initialItemExportFormConfigurationSingle(item: Item): Observable<ItemExportFormConfiguration> {
    const entityType = item.firstMetadataValue('dspace.entity.type') || 'none';

    return this.itemExportFormatService.byEntityTypeAndMolteplicity(entityType, ItemExportFormatMolteplicity.SINGLE).pipe(
      take(1),
      map(values => this.buildConfiguration(null, entityType, values[entityType])),
    );
  }

  /**
   * Initialize export form configuration for a multiple/bulk item export.
   * Resolves all available entity types and their formats.
   * @returns Observable emitting the form configuration for bulk export
   */
  protected initialItemExportFormConfigurationMultiple(): Observable<ItemExportFormConfiguration> {
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(null, ItemExportFormatMolteplicity.MULTIPLE).pipe(
      take(1),
      map(values => this.buildConfiguration(Object.keys(values), null, [])),
    );
  }

  /**
   * Build an ItemExportFormConfiguration from the given parameters.
   * @param entityTypes - Available entity types (for bulk export selection)
   * @param entityType - The currently selected entity type
   * @param formats - The available export formats for the selected entity type
   * @returns The constructed form configuration
   */
  protected buildConfiguration(entityTypes: string[], entityType: string, formats: ItemExportFormat[]): ItemExportFormConfiguration {
    const _formats = formats ? formats : [];
    return {
      entityType,
      format: _formats.length > 0 ? _formats[0] : null,
      entityTypes: entityTypes,
      formats: _formats,
    };
  }

}
