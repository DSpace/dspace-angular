import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  NavigationExtras,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { RolesService } from '../core/roles/roles.service';
import { isEmpty } from '../shared/empty.util';
import { MYDSPACE_ROUTE } from './my-dspace-page.component';
import { MyDSpaceConfigurationType } from './mydspace-configuration-type';

// reducers

/**
 * Prevent unauthorized activating and loading of routes
 * @class MyDSpaceGuard
 */
@Injectable()
export class MyDSpaceGuard implements CanActivate, CanLoad {

  private isController$: Observable<boolean>;
  private isSubmitter$: Observable<boolean>;

  /**
   * @constructor
   */
  constructor(private rolesService: RolesService, private router: Router) {
    this.isSubmitter$ = this.rolesService.isSubmitter();
    this.isController$ = this.rolesService.isController();
  }

  /**
   * True when user is authenticated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.combineLatest(this.isSubmitter$, this.isController$)
      .first()
      .map(([isSubmitter, isController]) => {
        if (this.getSearchConfiguration(route.paramMap.get('configuration') as MyDSpaceConfigurationType, isSubmitter, isController)) {
          return true;
        } else {
          return true;
        }
      });
  }

  /**
   * True when user is authenticated
   * @method canActivateChild
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * True when user is authenticated
   * @method canLoad
   */
  canLoad(route: Route): Observable<boolean> {
    return Observable.of(true);
  }

  private getAvailableConfiguration(isSubmitter: boolean, isController: boolean): MyDSpaceConfigurationType[] {
    const availableConf: MyDSpaceConfigurationType[] = [];
    if (isSubmitter || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workspace);
    }
    if (isController || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workflow);
    }
    return availableConf;
  }

  private getSearchConfiguration(configurationParam: MyDSpaceConfigurationType, isSubmitter: boolean, isController: boolean) {
    const configurationDefault: MyDSpaceConfigurationType = (isSubmitter || (!isSubmitter && !isController)) ?
      MyDSpaceConfigurationType.Workspace :
      MyDSpaceConfigurationType.Workflow;
    if (isEmpty(configurationParam) || !this.getAvailableConfiguration(isSubmitter, isController).includes(configurationParam)) {
      // If configuration param is empty or is not included in available configurations redirect to a default configuration value
      const navigationExtras: NavigationExtras = {
        queryParams: {configuration: configurationDefault},
        // queryParamsHandling: 'merge'
      };

      this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
      return null;
    } else {
      return configurationParam;
    }
  }
}
