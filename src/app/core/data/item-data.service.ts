import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Item } from '../shared/item.model';
import { URLCombiner } from '../url-combiner/url-combiner';

import { DataService } from './data.service';
import { RequestService } from './request.service';

@Injectable()
export class ItemDataService extends DataService<NormalizedItem, Item> {
  protected linkName = 'items';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    private bs: BrowseService
  ) {
    super(NormalizedItem);
  }

  public getScopedEndpoint(scopeID: string): Observable<string> {
    if (isEmpty(scopeID)) {
      return this.getEndpoint();
    } else {
      return this.bs.getBrowseURLFor('dc.date.issued', this.linkName)
        .filter((href: string) => isNotEmpty(href))
        .distinctUntilChanged();
    }
  }

}
