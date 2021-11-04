import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RootDataService } from '../data/root-data.service';
import { map, tap } from 'rxjs/operators';
import { RemoteData } from '../data/remote-data';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServerCheckGuard implements CanActivate {
  constructor(private router: Router,private rootDataService: RootDataService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.rootDataService.findRoot().pipe(
      map( (res: RemoteData<any>) => res.hasSucceeded ),
      tap( (responsehasSucceeded: boolean) => {
        if (!responsehasSucceeded) {
          this.router.navigateByUrl(getPageInternalServerErrorRoute());
        }
      }),
    );

  }
}
