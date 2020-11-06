import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { find, tap } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
import { Audit } from '../core/audit/model/audit.model';
import { AuditDataService } from '../core/audit/audit-data.service';
import { getAllSucceededRemoteData } from '../core/shared/operators';

/**
 * This class represents a resolver that requests a specific audit before the route is activated
 */
@Injectable()
export class AuditPageResolver implements Resolve<RemoteData<Audit>> {
  constructor(private auditService: AuditDataService) {
  }

  /**
   * Method for resolving an audit based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Audit>> Emits the found process based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Audit>> {
    // return this.auditService.findById(route.params.id, followLink('eperson')).pipe(
    return this.auditService.findById(route.params.id).pipe(
      tap(value => {  }),
      getAllSucceededRemoteData(),
      find((RD) => hasValue(RD.error) || RD.hasSucceeded),
    );
  }
}
