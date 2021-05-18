import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getForbiddenRoute } from '../../../app/app-routing-paths';
import { ResearcherProfileService } from '../../../app/core/profile/researcher-profile.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPageUnlinkOrcidGuard implements CanActivate {

  constructor(protected researcherProfileService: ResearcherProfileService,
    protected router: Router) {

  }

  canActivate(): Observable<boolean | UrlTree>  {
    return this.researcherProfileService.adminCanDisconnectProfileFromOrcid().pipe(
      map((canDisconnect) => {
        return canDisconnect ? true : this.router.parseUrl(getForbiddenRoute());
      })
    );
  }

}
