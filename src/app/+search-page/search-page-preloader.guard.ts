import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../core/data/remote-data';
import { getSucceededRemoteData } from '../core/shared/operators';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { SearchService } from './search-service/search.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchPagePreloader implements CanActivate {
  constructor(private searchService: SearchService, private configService: SearchConfigurationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const searchResults$ = this.configService.paginatedSearchOptions.flatMap((options) =>
      this.searchService.search(options)
    );
    route.data.results = searchResults$;
    return searchResults$.pipe(
      getSucceededRemoteData(),
      map(() => true),
    ).catch(() => Observable.of(false))
  }
}
