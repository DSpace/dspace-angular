import { Injectable } from '@angular/core';
import { Group } from '@dspace/core/eperson/models/group.model';
import {
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { getGroupEditRoute } from '../access-control-routing-paths';
import {
  GroupRegistryCancelGroupAction,
  GroupRegistryEditGroupAction,
} from './group-registry.actions';
import { GroupRegistryState } from './group-registry.reducers';

const groupRegistryStateSelector = (state: AppState) => state.groupRegistry;
export const editGroupSelector = createSelector(groupRegistryStateSelector, (groupRegistryState: GroupRegistryState) => groupRegistryState.editGroup);

@Injectable({
  providedIn: 'root',
})
export class GroupRegistryService {

  constructor(protected store: Store<AppState>) { }

  /**
   * Method to retrieve the group that is currently being edited
   */
  public getActiveGroup(): Observable<Group> {
    return this.store.pipe(select(editGroupSelector));
  }

  /**
   * Method to cancel editing a group, dispatches a cancel group action
   */
  public cancelEditGroup() {
    this.store.dispatch(new GroupRegistryCancelGroupAction());
  }

  /**
   * Method to set the group being edited, dispatches an edit group action
   * @param group The group to edit
   */
  public editGroup(group: Group) {
    this.store.dispatch(new GroupRegistryEditGroupAction(group));
  }

  /**
   * Get Edit page of group
   * @param groupID Group ID we want edit page for
   */
  public getGroupEditPageRouterLinkWithID(groupID: string): string {
    return getGroupEditRoute(groupID);
  }

  /**
   * Change which group is being edited and return the link for the edit page of the new group being edited
   * @param newGroup New group to edit
   */
  public startEditingNewGroup(newGroup: Group): string {
    this.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (newGroup === activeGroup) {
        this.cancelEditGroup();
      } else {
        this.editGroup(newGroup);
      }
    });
    return this.getGroupEditPageRouterLinkWithID(newGroup.id);
  }

}
