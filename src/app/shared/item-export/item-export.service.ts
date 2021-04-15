import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ItemExportFormat } from '../../core/itemexportformat/model/item-export-format.model';
import { Item } from '../../core/shared/item.model';
import { isEmpty } from '../empty.util';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService
} from '../../core/itemexportformat/item-export-format.service';

export interface ItemExportFormConfiguration {
  entityType: string;
  format: ItemExportFormat;

  entityTypes: string[];
  formats: ItemExportFormat[];
}

@Injectable({
  providedIn: 'root'
})
export class ItemExportService {

  constructor(private itemExportFormatService: ItemExportFormatService) {
  }

  /**
   * Initialize the item export form configuration.
   * @param molteplicity
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
      map(values => this.buildConfiguration(entityTypes, entityType, values[entityType]))
    );
  }

  /**
   * Perform the export operation.
   * @param molteplicity
   * @param item
   * @param searchOptions
   * @param entityType
   * @param format
   */
  public submitForm(molteplicity, item, searchOptions, entityType, format): Observable<number> {
    if (molteplicity === ItemExportFormatMolteplicity.SINGLE) {
      return this.itemExportFormatService.doExport(item.uuid, format);
    } else {
      return this.itemExportFormatService.doExportMulti(entityType, format, searchOptions);
    }
  }

  protected initialItemExportFormConfigurationSingle(item: Item): Observable<ItemExportFormConfiguration> {
    const entityType = item.firstMetadataValue('dspace.entity.type');
    if (isEmpty(entityType)) {
      throw Error('cannot get item entityType');
    }
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(entityType, ItemExportFormatMolteplicity.SINGLE).pipe(
      take(1),
      map(values => this.buildConfiguration(null, entityType, values[entityType]))
    );
  }

  protected  initialItemExportFormConfigurationMultiple(): Observable<ItemExportFormConfiguration> {
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(null, ItemExportFormatMolteplicity.MULTIPLE).pipe(
      take(1),
      map(values => this.buildConfiguration(Object.keys(values), null, []))
    );
  }

  protected buildConfiguration(entityTypes: string[], entityType: string, formats: ItemExportFormat[]): ItemExportFormConfiguration {
    const _formats = formats ? formats : [];
    return {
      entityType,
      format: _formats.length > 0 ? _formats[0] : null,
      entityTypes: entityTypes,
      formats: _formats
    };
  }

}
