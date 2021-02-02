import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemExportFormat } from './model/item-export-format.model';
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
import { RequestEntry } from '../data/request.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { SearchOptions } from '../../shared/search/search-options.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { Process } from '../../process-page/processes/process.model';
import { getFirstCompletedRemoteData } from '../shared/operators';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class ItemExportFormatServiceImpl extends DataService<ItemExportFormat> {
  protected linkPath = 'itemexportformats';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemExportFormat>) {
    super();
  }

}

export enum ItemExportFormatMolteplicity {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE'
}

/**
 * A service that provides methods to make REST requests with item export format endpoint.
 */
@Injectable()
@dataService(ITEM_EXPORT_FORMAT)
export class ItemExportFormatService {

  dataService: ItemExportFormatServiceImpl;

  responseMsToLive: number = 10 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemExportFormat>,
    protected itemService: ItemDataService,
    protected translate: TranslateService,
    private scriptDataService: ScriptDataService) {

    this.dataService = new ItemExportFormatServiceImpl(requestService, rdbService, store, objectCache, halService,
      notificationsService, http, comparator);

  }

  /**
   * Get all item export formats for the requested entityType and compatible with the given molteplicity
   *
   * @param entityTypeId The entityType id (null means every entity types)
   * @param molteplicity The requested molteplicity
   * @return Observable<{ [entityType: string]: ItemExportFormat[]}>
   *    dictionary which map for the requested entityTypesId all the allowed export formats
   */
  byEntityTypeAndMolteplicity(entityTypeId: string, molteplicity: ItemExportFormatMolteplicity): Observable<{ [entityType: string]: ItemExportFormat[] }> {
    const searchHref = 'byEntityTypeAndMolteplicity';

    const searchParams = [];
    if (molteplicity) {
      searchParams.push(new RequestParam('molteplicity', molteplicity));
    }
    if (entityTypeId) {
      searchParams.push(new RequestParam('entityTypeId', entityTypeId));
    }

    return this.dataService.searchBy(searchHref, { searchParams, elementsPerPage: 100 }).pipe(
      filter((itemExportFormats: RemoteData<PaginatedList<ItemExportFormat>>) => !itemExportFormats.isResponsePending),
      map((response) => {
        const page = {};
        response.payload.page.forEach((format) => page[format.entityType] = page[format.entityType] ? [...page[format.entityType], format] : [format]);
        return page;
      }));
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
   *
   * @return an Observable containing the processNumber if the script starts successfully, or null in case of errors
   */
  public doExportMulti(entityType: string, format: ItemExportFormat, searchOptions: SearchOptions): Observable<number> {

    let parameterValues = [];
    parameterValues = this.entityTypeParameter(entityType, parameterValues);
    parameterValues = this.formatParameter(format, parameterValues);
    parameterValues = this.queryParameter(searchOptions, parameterValues);
    parameterValues = this.filtersParameter(searchOptions, parameterValues);
    parameterValues = this.scopeParameter(searchOptions, parameterValues);
    parameterValues = this.configurationParameter(searchOptions, parameterValues);
    parameterValues = this.sortParameter(searchOptions, parameterValues);

    return this.launchScript(BULK_ITEM_EXPORT_SCRIPT_NAME, parameterValues);
  }

  private launchScript(scriptName: string, parameterValues: ProcessParameter[]): Observable<number> {
    return this.scriptDataService.invoke(scriptName, parameterValues, [])
      .pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<Process>) => {
          if (rd.isSuccess) {
            const title = this.translate.get('process.new.notification.success.title');
            const content = this.translate.get('process.new.notification.success.content');
            this.notificationsService.success(title, content);
            const payload: any = rd.payload;
            if (isNotEmpty(payload.resourceSelfLinks)) {
              const processNumber = payload.resourceSelfLinks[0].split('/').pop();
              return processNumber;
            }
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
        .map((searchFilter) => searchFilter.key.replace('f.', '') + '=' + searchFilter.values[0])
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
    // if (searchOptions.scope) {
    //   return [...parameterValues, Object.assign(new ProcessParameter(), { name: '-s', value: searchOptions.scope })];
    // }
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
