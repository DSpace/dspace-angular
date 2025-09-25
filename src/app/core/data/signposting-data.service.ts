import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { SignpostingLink } from './signposting-links.model';

/**
 * Service responsible for handling requests related to the Signposting endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class SignpostingDataService {

  constructor(@Inject(APP_CONFIG) protected appConfig: AppConfig, private restService: DspaceRestService) {
  }

  /**
   * Retrieve the list of signposting links related to the given resource's id
   *
   * @param uuid
   */
  getLinks(uuid: string): Observable<SignpostingLink[]> {
    const baseUrl = `${this.appConfig.rest.baseUrl}`;

    return this.restService.get(`${baseUrl}/signposting/links/${uuid}`).pipe(
      catchError((err: unknown) => {
        return of([]);
      }),
      map((res: RawRestResponse) => res.statusCode === 200 ? res.payload as SignpostingLink[] : []),
    );
  }

}
