import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, tap } from 'rxjs';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { buildPaginatedList, PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { SearchResult } from 'src/app/shared/search/models/search-result.model';
import { DSOSelectorComponent } from '../dso-selector.component';
import { followLink } from '../../../utils/follow-link-config.model';
import { getFirstCompletedRemoteData, mapRemoteDataPayload } from 'src/app/core/shared/operators';
import { hasValue } from 'src/app/shared/empty.util';
import { ItemSearchResult } from 'src/app/shared/object-collection/shared/item-search-result.model';

@Component({
  selector: 'ds-editable-item-selector',
  templateUrl: '../dso-selector.component.html',
  styleUrls: ['../dso-selector.component.scss']
})
export class EditableItemSelectorComponent extends DSOSelectorComponent {

  constructor(
    protected searchService: SearchService,
    protected itemDataService: ItemDataService,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected dsoNameService: DSONameService
  ) {
    super(searchService, notificationsService, translate, dsoNameService);
  }

  search(query: string, page: number):
    Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>
  {
    return this.itemDataService.findItemsWithEdit(followLink('owningCollection')).pipe(
      getFirstCompletedRemoteData(),
      tap((rdata) => console.log('TEST:', rdata)),
      mapRemoteDataPayload((payload) => hasValue(payload)
        ? buildPaginatedList(payload.pageInfo, payload.page.map((item) =>
            Object.assign(new ItemSearchResult(), { indexableObject: item })))
        : null));
  }

}
