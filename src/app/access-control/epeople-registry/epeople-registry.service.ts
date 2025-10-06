import { Injectable } from '@angular/core';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import {
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { getEPersonEditRoute } from '../access-control-routing-paths';
import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction,
} from './epeople-registry.actions';
import { EPeopleRegistryState } from './epeople-registry.reducers';

const ePeopleRegistryStateSelector = (state: AppState) => state.epeopleRegistry;
export const editEPersonSelector = createSelector(ePeopleRegistryStateSelector, (ePeopleRegistryState: EPeopleRegistryState) => ePeopleRegistryState.editEPerson);

@Injectable({
  providedIn: 'root',
})
export class EpeopleRegistryService {

  constructor(protected store: Store<AppState>) {
  }

  /**
   * Method to retrieve the eperson that is currently being edited
   */
  public getActiveEPerson(): Observable<EPerson> {
    return this.store.pipe(select(editEPersonSelector));
  }

  /**
   * Method to cancel editing an EPerson, dispatches a cancel EPerson action
   */
  public cancelEditEPerson() {
    this.store.dispatch(new EPeopleRegistryCancelEPersonAction());
  }

  /**
   * Method to set the EPerson being edited, dispatches an edit EPerson action
   * @param ePerson The EPerson to edit
   */
  public editEPerson(ePerson: EPerson) {
    this.store.dispatch(new EPeopleRegistryEditEPersonAction(ePerson));
  }

  /**
   * Change which ePerson is being edited and return the link for EPeople edit page
   * @param ePerson New EPerson to edit
   */
  public startEditingNewEPerson(ePerson: EPerson): string {
    this.getActiveEPerson().pipe(take(1)).subscribe((activeEPerson: EPerson) => {
      if (ePerson === activeEPerson) {
        this.cancelEditEPerson();
      } else {
        this.editEPerson(ePerson);
      }
    });
    return getEPersonEditRoute(ePerson.id);
  }
}
