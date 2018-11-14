import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { AdminSidebarSectionsState, AdminSidebarSectionState } from './admin-sidebar.reducer';
import { hasValue } from '../../shared/empty.util';
import { map } from 'rxjs/operators';
import { AdminSidebarSectionToggleAction } from './admin-sidebar.actions';

const sidebarSectionStateSelector = (state: AdminSidebarSectionsState) => state.adminSidebarSection;

const sectionByNameSelector = (name: string): MemoizedSelector<AdminSidebarSectionsState, AdminSidebarSectionState> => {
  return keySelector<AdminSidebarSectionState>(name);
};

export function keySelector<T>(key: string): MemoizedSelector<AdminSidebarSectionsState, T> {
  return createSelector(sidebarSectionStateSelector, (state: AdminSidebarSectionState) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}
@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  constructor(private store: Store<AdminSidebarSectionsState>) {

  }

  public active(name: string): Observable<boolean> {
    return this.store.pipe(
      select(sectionByNameSelector(name)),
      map((state: AdminSidebarSectionState) => hasValue(state) ? !state.sectionCollapsed : false)
    );
  }

  toggle(event: Event, name: string) {
    event.preventDefault();
    this.store.dispatch(new AdminSidebarSectionToggleAction(name));
  }
}
