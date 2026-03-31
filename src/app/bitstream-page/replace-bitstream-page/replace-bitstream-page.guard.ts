import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const replaceBitstreamPageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  configurationService: ConfigurationDataService = inject(ConfigurationDataService),
): Observable<UrlTree | boolean> => {
  return configurationService.findByPropertyName('replace-bitstream.enabled').pipe(
    getFirstSucceededRemoteDataPayload(),
    map(payload => payload?.values.length > 0 && payload?.values[0] === 'true'),
  );
};
