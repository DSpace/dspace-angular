import { Injectable } from '@angular/core';
import { Audit } from '@dspace/core/audit/model/audit.model';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { RequestParam } from '@dspace/core/cache/models/request-param.model';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { AuditDataService } from '@dspace/core/data/audit-data.service';
import { SearchDataImpl } from '@dspace/core/data/base/search-data';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';

export const AUDIT_FIND_BY_FILTERS_SEARCH_METHOD = 'findByFilters';

/**
 * Filtros aceitos pelo endpoint /api/system/auditevents/search/findByFilters (HU009 D9, CA09.3).
 * Datas no formato YYYY-MM-DD; objeto e usuário por UUID.
 */
export interface AuditFilters {
  types?: string[];
  object?: string;
  eperson?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Acrescenta ao serviço de auditoria da base a busca combinada do backend. O `searchData` da base é privado,
 * por isso este serviço monta o próprio.
 */
@Injectable({ providedIn: 'root' })
export class RdappAuditDataService extends AuditDataService {

  private filtersSearchData: SearchDataImpl<Audit>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected dsoNameService: DSONameService,
  ) {
    super(requestService, rdbService, objectCache, halService, notificationsService, dsoNameService);
    this.filtersSearchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  findByFilters(filters: AuditFilters, options: FindListOptions = {}, useCachedVersionIfAvailable = true): Observable<RemoteData<PaginatedList<Audit>>> {
    const searchParams: RequestParam[] = [];
    if (filters.types?.length > 0) {
      searchParams.push(new RequestParam('types', filters.types.join(',')));
    }
    if (hasValue(filters.object)) {
      searchParams.push(new RequestParam('object', filters.object));
    }
    if (hasValue(filters.eperson)) {
      searchParams.push(new RequestParam('eperson', filters.eperson));
    }
    if (hasValue(filters.dateFrom)) {
      searchParams.push(new RequestParam('dateFrom', filters.dateFrom));
    }
    if (hasValue(filters.dateTo)) {
      searchParams.push(new RequestParam('dateTo', filters.dateTo));
    }
    const optionsWithFilters = Object.assign(new FindListOptions(), options, { searchParams });
    return this.filtersSearchData.searchBy(AUDIT_FIND_BY_FILTERS_SEARCH_METHOD, optionsWithFilters, useCachedVersionIfAvailable, true, followLink('eperson'));
  }
}
