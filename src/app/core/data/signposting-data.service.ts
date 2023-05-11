import { Injectable } from '@angular/core';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
// import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
// import { throwError } from 'rxjs';
import { Observable, of as observableOf } from 'rxjs';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignpostingDataService {

  constructor(private restService: DspaceRestService, protected halService: HALEndpointService) { }

  getLinks(uuid: string): Observable<any> {
    const baseUrl = this.halService.getRootHref().replace('/api', '');

    return this.restService.get(`${baseUrl}/signposting/links/${uuid}`).pipe(
      catchError((err ) => {
        console.error(err);
        return observableOf(false);
      }),
      map((res: RawRestResponse) => res)
    );
  }

  getLinksets(uuid: string): Observable<string> {
    const baseUrl = this.halService.getRootHref().replace('/api', '');

    const requestOptions = {
      observe: 'response' as any,
      headers: new HttpHeaders({
        'accept': 'application/linkset',
        'Content-Type': 'application/linkset'
      }),
      responseType: 'text'
    } as any;

    return this.restService.getWithHeaders(`${baseUrl}/signposting/linksets/${uuid}`, requestOptions).pipe(
      catchError((err ) => {
        console.error(err);
        return observableOf(false);
      }),
      map((res: RawRestResponse) => res.payload.body)
    );
  }
}
