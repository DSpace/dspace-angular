import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { Item } from '../shared/item.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Observable } from 'rxjs/Observable';
import { BrowseService } from '../browse/browse.service';
import { isNotEmpty } from '../../shared/empty.util';

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
    return this.bs.getBrowseURLFor('dc.date.issued', this.linkName)
      .filter((href) => isNotEmpty(href))
      .distinctUntilChanged();
  }

}
