import { Injectable } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Eperson } from '../eperson/models/eperson.model';
import { Observable } from 'rxjs/Observable';
import { getAuthenticatedUser } from '../auth/selectors';
import { isNotEmpty } from '../../shared/empty.util';
import { findIndex } from 'lodash';

@Injectable()
export class RolesService {
  user: Observable<Eperson>;

  constructor(private store: Store<AppState>) {
    this.user = this.store.select(getAuthenticatedUser);
  }

  protected groupExists(groupName): Observable<boolean> {
    this.user
      .map((user: Eperson) => {
        if (isNotEmpty(user)) {
          return (findIndex(user.groups, { name: groupName }) !== -1);
        } else {
          return false;
        }
      })
  }

  isSubmitter(): Observable<boolean> {
    return this.groupExists('Submitters');
  }

  isController(): Observable<boolean> {
    return this.groupExists('Controllers');
  }
}
