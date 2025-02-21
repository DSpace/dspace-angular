import { Injectable } from '@angular/core';
import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../../modules/core/src/lib/core/data/remote-data';
import { EPerson } from '../../../../modules/core/src/lib/core/eperson/models/eperson.model';
import { DSpaceObject } from '../../../../modules/core/src/lib/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../../modules/core/src/lib/core/shared/operators';
import { PaginatedSearchOptions } from '../../../../modules/core/src/lib/core/shared/paginated-search-options.model';
import { SearchObjects } from '../../../../modules/core/src/lib/core/shared/search/models/search-objects.model';
import { SearchService } from '../../../../modules/core/src/lib/core/shared/search/search.service';
import { createNoContentRemoteDataObject } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';

/**
 * Service that handle profiles claim.
 */
@Injectable({ providedIn: 'root' })
export class ProfileClaimService {

  constructor(private searchService: SearchService) {
  }

  /**
   * Returns true if it is possible to suggest profiles to be claimed to the given eperson.
   *
   * @param eperson the eperson
   */
  hasProfilesToSuggest(eperson: EPerson): Observable<boolean> {
    return this.searchForSuggestions(eperson).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<SearchObjects<DSpaceObject>>) => {
        return isNotEmpty(rd) && rd.hasSucceeded && rd.payload?.page?.length > 0;
      }),
    );
  }

  /**
   * Returns profiles that could be associated with the given user.
   *
   * @param eperson the user
   */
  searchForSuggestions(eperson: EPerson): Observable<RemoteData<SearchObjects<DSpaceObject>>> {
    const query = this.personQueryData(eperson);
    if (isEmpty(query)) {
      return of(createNoContentRemoteDataObject() as RemoteData<SearchObjects<DSpaceObject>>);
    }
    return this.lookup(query);
  }

  /**
   * Search object by the given query.
   *
   * @param query the query for the search
   */
  private lookup(query: string): Observable<RemoteData<SearchObjects<DSpaceObject>>> {
    if (isEmpty(query)) {
      return of(createNoContentRemoteDataObject() as RemoteData<SearchObjects<DSpaceObject>>);
    }
    return this.searchService.search(new PaginatedSearchOptions({
      configuration: 'eperson_claims',
      query: query,
    }), null, false, true);
  }

  /**
   * Return the search query for person lookup, from the given eperson
   *
   * @param eperson The eperson to use for the lookup
   */
  private personQueryData(eperson: EPerson): string {
    if (eperson && eperson.email) {
      return 'person.email:' + eperson.email;
    } else {
      return null;
    }
  }

}
