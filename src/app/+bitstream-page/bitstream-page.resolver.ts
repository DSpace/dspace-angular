import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
import { Bitstream } from '../core/shared/bitstream.model';
import { BitstreamDataService } from '../core/data/bitstream-data.service';

/**
 * This class represents a resolver that requests a specific bitstream before the route is activated
 */
@Injectable()
export class BitstreamPageResolver implements Resolve<RemoteData<Bitstream>> {
  constructor(private bitstreamService: BitstreamDataService) {
  }

  /**
   * Method for resolving a bitstream based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found bitstream based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Bitstream>> {
    return this.bitstreamService.findById(route.params.id)
      .pipe(
        find((RD) => hasValue(RD.error) || RD.hasSucceeded),
      );
  }
}
