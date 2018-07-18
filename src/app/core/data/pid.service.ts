import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { hasValue } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from './remote-data';
import { FindByIDRequest } from './request.models';
import { RequestService } from './request.service';

@Injectable()
export class PIDService {
  protected linkPath = 'pid';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService) {
  }

  findById(id: string): Observable<RemoteData<DSpaceObject>> {
    const hrefObs = this.halService.getEndpoint(this.linkPath)
      .map((endpoint: string) => endpoint.replace(/\{\?id\}/,`?id=${id}`));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new FindByIDRequest(this.requestService.generateRequestId(), href, id);
        this.requestService.configure(request);
      });

    return this.rdbService.buildSingle<NormalizedDSpaceObject, DSpaceObject>(hrefObs);
  }
}
