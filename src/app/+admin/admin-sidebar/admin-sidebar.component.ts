import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { AdminSidebarSectionState, AdminSidebarState, } from './admin-sidebar.reducer';
import { hasValue } from '../../shared/empty.util';
import { map } from 'rxjs/operators';
import { AdminSidebarSectionToggleAction, AdminSidebarToggleAction } from './admin-sidebar.actions';
import { AppState, keySelector } from '../../app.reducer';
import { slideSidebar } from '../../shared/animations/slide';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';

const sidebarSectionStateSelector = (state: AppState) => state.adminSidebar.sections;
const sidebarStateSelector = (state) => state.adminSidebar;

const sectionByNameSelector = (name: string): MemoizedSelector<AppState, AdminSidebarSectionState> => {
  return keySelector<AdminSidebarSectionState>(name, sidebarSectionStateSelector);
};

@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideSidebar]
})
export class AdminSidebarComponent implements OnInit {
  sidebarCollapsed: Observable<boolean>;
  sidebarWidth: Observable<string>;

  constructor(private store: Store<AdminSidebarState>,
              private variableService: CSSVariableService) {
  }

  ngOnInit(): void {
    this.sidebarWidth = this.variableService.getVariable('adminSidebarWidth')
    this.sidebarCollapsed = this.store.pipe(
      select(sidebarStateSelector),
      map((state: AdminSidebarState) => state.collapsed)
    );
  }

  public active(name: string): Observable<boolean> {
    return this.store.pipe(
      select(sectionByNameSelector(name)),
      map((state: AdminSidebarSectionState) => hasValue(state) ? !state.sectionCollapsed : false)
    );
  }

  toggleSection(event: Event, name: string) {
    event.preventDefault();
    this.store.dispatch(new AdminSidebarSectionToggleAction(name));
  }

  toggle(event: Event) {
    event.preventDefault();
    this.store.dispatch(new AdminSidebarToggleAction());
  }
}
