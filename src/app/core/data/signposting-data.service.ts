import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';

import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { SignpostingLink } from './signposting-links.model';

/**
 * Service responsible for handling requests related to the Signposting endpoint
 */
@Injectable({
  providedIn: 'root'
})
export class SignpostingDataService {

  constructor(private restService: DspaceRestService, protected halService: HALEndpointService) {
  }

  /**
   * Retrieve the list of signposting links related to the given resource's id
   *
   * @param uuid
   */
  getLinks(uuid: string): Observable<SignpostingLink[]> {
    const baseUrl = this.halService.getRootHref().replace('/api', '');

    return this.restService.get(`${baseUrl}/signposting/links/${uuid}`).pipe(
      catchError((err) => {
        return observableOf([]);
      }),
      map((res: RawRestResponse) => res.statusCode === 200 ? res.payload as SignpostingLink[] : [])
    );
  }

}
