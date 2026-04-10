import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DsoRedirectService } from '../core/data/dso-redirect.service';
import { RemoteData } from '../core/data/remote-data';
import { IdentifierType } from '../core/data/request.models';
import { DSpaceObject } from '../core/shared/dspace-object.model';

interface LookupParams {
  type: IdentifierType;
  id: string;
}

export const lookupGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  dsoService: DsoRedirectService = inject(DsoRedirectService),
): Observable<boolean> => {
  const params = getLookupParams(route);
  return dsoService.findByIdAndIDType(params.id, params.type).pipe(
    map((response: RemoteData<DSpaceObject>) => response.hasFailed),
  );
};

function getLookupParams(route: ActivatedRouteSnapshot): LookupParams {
  let type;
  let id;
  const idType = route.params.idType;

  // If the idType is not recognized, assume a legacy handle request (handle/prefix/id)
  if (idType !== IdentifierType.HANDLE && idType !== IdentifierType.UUID) {
    type = IdentifierType.HANDLE;
    const prefix = route.params.idType;
    const handleId = route.params.id;
    id = `hdl:${prefix}/${handleId}`;

  } else if (route.params.idType === IdentifierType.HANDLE) {
    type = IdentifierType.HANDLE;
    id = 'hdl:' + route.params.id;

  } else {
    type = IdentifierType.UUID;
    id = route.params.id;
  }
  return {
    type: type,
    id: id,
  };
}
