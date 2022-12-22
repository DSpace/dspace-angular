import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getForbiddenRoute } from '../../app-routing-paths';
import { OrcidAuthService } from '../../core/orcid/orcid-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPageUnlinkOrcidGuard implements CanActivate {

  constructor(
    protected orcidAuthService: OrcidAuthService,
    protected router: Router) {

  }

  canActivate(): Observable<boolean | UrlTree>  {
    return this.orcidAuthService.onlyAdminCanDisconnectProfileFromOrcid().pipe(
      map((canDisconnect) => {
        return canDisconnect ? true : this.router.parseUrl(getForbiddenRoute());
      })
    );
  }

}
