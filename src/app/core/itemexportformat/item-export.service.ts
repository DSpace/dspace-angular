import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
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
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';
import { ProcessParameter } from 'src/app/process-page/processes/process-parameter.model';
import { ITEM_EXPORT_SCRIPT_NAME, ScriptDataService } from '../data/processes/script-data.service';
import { RequestEntry } from '../data/request.reducer';
import { isNotEmpty } from 'src/app/shared/empty.util';
import { TranslateService } from '@ngx-translate/core';

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
  MULTI = 'MULTI'
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
   * @param entityTypeId The entityType id
   * @param molteplicity The requested molteplicity 
   * @param options The [[FindListOptions]] object
   * @return Observable<RemoteData<PaginatedList<ItemExportFormat>>>
   *    item export formats list
   */
  byEntityTypeAndMolteplicity(entityTypeId: string, molteplicity: ItemExportFormatMolteplicity, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<ItemExportFormat>>> {
    const searchHref = 'byEntityTypeAndMolteplicity';
    options = Object.assign({}, options, {
      searchParams: [
        new RequestParam('entityTypeId', entityTypeId),
        new RequestParam('molteplicity', molteplicity)
      ]
    });

    return this.dataService.searchBy(searchHref, options).pipe(
      filter((itemExportFormats: RemoteData<PaginatedList<ItemExportFormat>>) => !itemExportFormats.isResponsePending));
  }

  /**
   * Starts item-export script with -i uuid -f format 
   * @param uuid 
   * @param format 
   *  
   * @return an Observable containing the processNumber if the script starts successfully, or null in case of errors
   */
  public doExport(uuid: string, format: string): Observable<number> {

    const parameterValues: ProcessParameter[] = [
      Object.assign(new ProcessParameter(), { name: '-i', value: uuid }),
      Object.assign(new ProcessParameter(), { name: '-f', value: format }),
    ];
    debugger;
    return this.scriptDataService.invoke(ITEM_EXPORT_SCRIPT_NAME, parameterValues, [])
      .pipe(
        take(1),
        map((requestEntry: RequestEntry) => {
          if (requestEntry.response.isSuccessful) {
            const title = this.translate.get('process.new.notification.success.title');
            const content = this.translate.get('process.new.notification.success.content');
            this.notificationsService.success(title, content);
            const response: any = requestEntry.response;
            if (isNotEmpty(response.resourceSelfLinks)) {
              const processNumber = response.resourceSelfLinks[0].split('/').pop();
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
}
