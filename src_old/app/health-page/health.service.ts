import { Injectable } from '@angular/core';
import { DspaceRestService } from '@dspace/core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from '@dspace/core/dspace-rest/raw-rest-response.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(protected halService: HALEndpointService,
        protected restService: DspaceRestService) {
  }
  /**
     * @returns health data
     */
  getHealth(): Observable<RawRestResponse> {
    return this.halService.getEndpoint('/actuator').pipe(
      map((restURL: string) => restURL + '/health'),
      switchMap((endpoint: string) => this.restService.get(endpoint)));
  }

  /**
     * @returns information of server
     */
  getInfo(): Observable<RawRestResponse> {
    return this.halService.getEndpoint('/actuator').pipe(
      map((restURL: string) => restURL + '/info'),
      switchMap((endpoint: string) => this.restService.get(endpoint)));
  }
}
