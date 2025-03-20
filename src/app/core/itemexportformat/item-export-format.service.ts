import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../data/base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ItemDataService } from '../data/item-data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemExportFormat, ItemExportFormatMap } from './model/item-export-format.model';
import { ITEM_EXPORT_FORMAT } from './model/item-export-format.resource-type';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestParam } from '../cache/models/request-param.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import {
  BULK_ITEM_EXPORT_SCRIPT_NAME,
  ITEM_EXPORT_SCRIPT_NAME,
  ScriptDataService
} from '../data/processes/script-data.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchOptions } from '../../shared/search/models/search-options.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { Process } from '../../process-page/processes/process.model';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from '../shared/operators';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import findIndex from 'lodash/findIndex';

export enum ItemExportFormatMolteplicity {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE'
}

/**
 * A service that provides methods to make REST requests with item export format endpoint.
 */
@Injectable()
@dataService(ITEM_EXPORT_FORMAT)
export class ItemExportFormatService extends IdentifiableDataService<ItemExportFormat> {

  private searchData: SearchDataImpl<ItemExportFormat>;

  responseMsToLive: number = 10 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected dsoNameService: DSONameService,
    protected itemService: ItemDataService,
    protected translate: TranslateService,
    protected scriptDataService: ScriptDataService) {

    super('itemexportformats', requestService, rdbService, objectCache, halService);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Get all item export formats for the requested entityType and compatible with the given molteplicity
   *
   * @param entityTypeId The entityType id (null means every entity types)
   * @param molteplicity The requested molteplicity
   * @return Observable<{ [entityType: string]: ItemExportFormat[]}>
   *    dictionary which map for the requested entityTypesId all the allowed export formats
   */
  byEntityTypeAndMolteplicity(entityTypeId: string, molteplicity: ItemExportFormatMolteplicity): Observable<ItemExportFormatMap> {
    const searchHref = 'byEntityTypeAndMolteplicity';

    const searchParams = [];
    if (molteplicity) {
      searchParams.push(new RequestParam('molteplicity', molteplicity));
    }
    if (entityTypeId) {
      searchParams.push(new RequestParam('entityTypeId', entityTypeId));
    }

    return this.searchData.searchBy(searchHref, { searchParams, elementsPerPage: 100 }).pipe(
      getAllCompletedRemoteData(),
      map((itemExportFormatsRD: RemoteData<PaginatedList<ItemExportFormat>>) => {
        const formatMap = {};
        const sharedFormat = [];
        itemExportFormatsRD.payload.page.forEach((format) => {
          if (isEmpty(format.entityType)) {
            if (findIndex(sharedFormat, (entry) => entry.id === format.id) === -1) {
              sharedFormat.push(format);
            }
          } else {
            formatMap[format.entityType] = formatMap[format.entityType] ? [...formatMap[format.entityType], format] : [format];
          }
        });

        Object.keys(formatMap).forEach((itemType) => {
          formatMap[itemType] = [...formatMap[itemType], ...sharedFormat];
        });
        return formatMap;
      })
    );
  }

  /**
   * Starts item-export script.
   * @param uuid
   * @param format
   *
   * @return an Observable containing the processNumber if the script starts successfully, or null in case of errors
   */
  public doExport(uuid: string, format: ItemExportFormat): Observable<number> {

    let parameterValues = [];
    parameterValues = this.uuidParameter(uuid, parameterValues);
    parameterValues = this.formatParameter(format, parameterValues);

    return this.launchScript(ITEM_EXPORT_SCRIPT_NAME, parameterValues);
  }

  /**
   * * Starts a bulk-item-export script.
   *
   * @param entityType The requested entityType
   * @param format The requested export format
   * @param searchOptions the state of the search to model into a bulk-item-export process
   * @param itemList If not empty contains the list of item to export only
   *
   * @return an Observable containing the processNumber if the script starts successfully, or null in case of errors
   */
  public doExportMulti(entityType: string, format: ItemExportFormat, searchOptions: SearchOptions, itemList: string[] = []): Observable<number> {

    let parameterValues = [];
    parameterValues = this.formatParameter(format, parameterValues);
    if (isNotEmpty(itemList)) {
      parameterValues = this.listUUIDParameter(itemList.join(';'), parameterValues);
    } else {
      parameterValues = this.entityTypeParameter(entityType, parameterValues);
      parameterValues = this.queryParameter(searchOptions, parameterValues);
      parameterValues = this.filtersParameter(searchOptions, parameterValues);
      parameterValues = this.scopeParameter(searchOptions, parameterValues);
      parameterValues = this.configurationParameter(searchOptions, parameterValues);
      parameterValues = this.sortParameter(searchOptions, parameterValues);
    }

    return this.launchScript(BULK_ITEM_EXPORT_SCRIPT_NAME, parameterValues);
  }

  private launchScript(scriptName: string, parameterValues: ProcessParameter[]): Observable<number> {
    return this.scriptDataService.invoke(scriptName, parameterValues, [])
      .pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<Process>) => {
          if (rd.isSuccess) {
            const payload: any = rd.payload;
            return payload.processId;
          } else {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.content');
            this.notificationsService.error(title, content);
            return null;
          }
        }));
  }

  private uuidParameter(uuid: string, parameterValues: ProcessParameter[]): ProcessParameter[] {
    return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-i', value: uuid })];
  }

  private entityTypeParameter(entityType: string, parameterValues: ProcessParameter[]): ProcessParameter[] {
    return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-t', value: entityType })];
  }

  private formatParameter(format: ItemExportFormat, parameterValues: ProcessParameter[]): ProcessParameter[] {
    return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-f', value: format.id })];
  }

  private listUUIDParameter(list: string, parameterValues: ProcessParameter[]): ProcessParameter[] {
    return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-si', value: list })];
  }

  private queryParameter(searchOptions: SearchOptions, parameterValues: ProcessParameter[]): ProcessParameter[] {
    if (searchOptions.query) {
      return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-q', value: searchOptions.query })];
    }
    return parameterValues;
  }

  private filtersParameter(searchOptions: SearchOptions, parameterValues: ProcessParameter[]): ProcessParameter[] {
    if (searchOptions.filters && searchOptions.filters.length > 0) {
      const value = searchOptions.filters
        .filter((searchFilter) => searchFilter.key.includes('f.'))
        .map((searchFilter) => {
          const key = searchFilter.key.replace('f.', '');
          return searchFilter.values.map((filterValue) => `${key}=${filterValue}`).join('&');
        })
        .join('&');
      return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-sf', value })];
    }
    return parameterValues;
  }

  private scopeParameter(searchOptions: SearchOptions, parameterValues: ProcessParameter[]): ProcessParameter[] {
    if (searchOptions.fixedFilter) {
      const fixedFilter = searchOptions.fixedFilter.split('=');
      if (fixedFilter.length === 2 && fixedFilter[0] === 'scope') {
        return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-s', value: fixedFilter[1] })];
      }
    }
    if (searchOptions.scope) {
      return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-s', value: searchOptions.scope })];
    }
    return parameterValues;
  }

  private configurationParameter(searchOptions: SearchOptions, parameterValues: ProcessParameter[]): ProcessParameter[] {
    if (searchOptions.configuration) {
      return [...parameterValues, Object.assign(new ProcessParameter(), {
        name: '-c',
        value: searchOptions.configuration
      })];
    }
    return parameterValues;
  }

  private sortParameter(searchOptions: SearchOptions, parameterValues: ProcessParameter[]): ProcessParameter[] {
    if (searchOptions instanceof PaginatedSearchOptions) {
      return [...parameterValues, Object.assign(new ProcessParameter(), {
        name: '-so',
        value: searchOptions.sort.field + ',' + searchOptions.sort.direction
      })];
    }
    return parameterValues;
  }

}
