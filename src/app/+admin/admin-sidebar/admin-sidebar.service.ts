import { Injectable } from '@angular/core';
import { AppState, keySelector } from '../../app.reducer';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { AdminSidebarSectionState, AdminSidebarState } from './admin-sidebar.reducer';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { hasValue } from '../../shared/empty.util';
import {
  AdminSidebarSectionCollapseAllAction,
  AdminSidebarSectionToggleAction,
  AdminSidebarToggleAction
} from './admin-sidebar.actions';

const sidebarStateSelector = (state) => state.adminSidebar;
const sidebarSectionStateSelector = (state: AppState) => state.adminSidebar.sections;

const sectionByNameSelector = (name: string): MemoizedSelector<AppState, AdminSidebarSectionState> => {
  return keySelector<AdminSidebarSectionState>(name, sidebarSectionStateSelector);
};

/**
 * Service that performs all actions that have to do with search the admin sidebar
 */
@Injectable()
export class AdminSidebarService {

  constructor(private store: Store<AdminSidebarState>) {
  }

  isSidebarCollapsed(): Observable<boolean> {
    return this.store.pipe(
      select(sidebarStateSelector),
      map((state: AdminSidebarState) => state.collapsed)
    );
  }

  toggleSidebar(): void {
    this.store.dispatch(new AdminSidebarToggleAction());
  }

  toggleSection(name: string): void {
    this.store.dispatch(new AdminSidebarSectionToggleAction(name));
  }

  collapseAllSections(): void {
    this.store.dispatch(new AdminSidebarSectionCollapseAllAction());
  }

  isSectionCollapsed(name: string): Observable<boolean> {
    return this.store.pipe(
      select(sectionByNameSelector(name)),
      map((state: AdminSidebarSectionState) => hasValue(state) ? state.sectionCollapsed : true)
    );
  }
}
