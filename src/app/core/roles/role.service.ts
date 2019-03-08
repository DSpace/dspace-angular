import { Injectable } from '@angular/core';
import { AppState } from '../../app.reducer';

import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RoleType } from './role-types';
import { CollectionDataService } from '../data/collection-data.service';

@Injectable()
export class RoleService {

  constructor(
    private collectionService: CollectionDataService,
    private store: Store<AppState>) {

  }

  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(
      distinctUntilChanged()
    );
  }

  isController(): Observable<boolean> {
    // TODO find a way to check if user is a controller
    return observableOf(true);
  }

  isAdmin(): Observable<boolean> {
    // TODO find a way to check if user is an admin
    return observableOf(false);
  }

  checkRole(role: RoleType): Observable<boolean> {
    let check: Observable<boolean>;
    switch (role) {
      case RoleType.Submitter:
        check = this.isSubmitter();
        break;
      case RoleType.Controller:
        check = this.isController();
        break;
      case RoleType.Admin:
        check = this.isAdmin();
        break;
    }

    return check;
  }
}
