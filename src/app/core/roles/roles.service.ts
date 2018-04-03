import { Injectable } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Eperson } from '../eperson/models/eperson.model';
import { Observable } from 'rxjs/Observable';
import { getAuthenticatedUser } from '../auth/selectors';
import { isNotEmpty } from '../../shared/empty.util';
import { findIndex } from 'lodash';
import { GroupEpersonService } from '../eperson/group-eperson.service';
import { Group } from '../eperson/models/group.model';
import { EpersonData } from '../eperson/eperson-data';

@Injectable()
export class RolesService {
  user: Observable<Eperson>;

  constructor(private groupService: GroupEpersonService, private store: Store<AppState>) {
    this.user = this.store.select(getAuthenticatedUser);
  }

  protected groupExists(groupName): Observable<boolean> {
    // return this.user
    //   .map((user: Eperson) => {
    //     if (isNotEmpty(user)) {
    //       return (findIndex(user.groups, { name: groupName }) !== -1);
    //     } else {
    //       return false;
    //     }
    //   })
    //   .distinctUntilChanged()
    return this.groupService.isMemberOf(groupName)
      .map((group: EpersonData) => {
        return isNotEmpty(group.payload);
      })
      .filter((response: boolean) => isNotEmpty(response))
      .distinctUntilChanged()
  }

  isSubmitter(): Observable<boolean> {
    return this.groupExists('Submitters');
  }

  isController(): Observable<boolean> {
    return this.groupExists('Controllers');
  }
}
