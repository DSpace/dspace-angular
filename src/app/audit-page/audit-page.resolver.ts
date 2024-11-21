import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuditDataService } from '../core/audit/audit-data.service';
import { Audit } from '../core/audit/model/audit.model';
import { RemoteData } from '../core/data/remote-data';
import { getFirstSucceededRemoteData } from '../core/shared/operators';


/**
 * Method for resolving an audit based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns Observable<<RemoteData<Audit>> Emits the found process based on the parameters in the current route,
 * or an error if something went wrong
 */
export const auditPageResolver: ResolveFn<RemoteData<Audit>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Audit>> => {
  const auditService = inject(AuditDataService);
  return auditService.findById(route.params.id).pipe(
    getFirstSucceededRemoteData(),
  );
};
