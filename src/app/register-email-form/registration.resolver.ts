import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Registration } from '../core/shared/registration.model';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Resolver to resolve a Registration object based on the provided token
 */
export class RegistrationResolver implements Resolve<Registration> {

  constructor(private epersonRegistrationService: EpersonRegistrationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Registration> {
    const token = route.params.token;
    return this.epersonRegistrationService.searchByToken(token);
  }
}
