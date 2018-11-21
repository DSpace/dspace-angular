import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { AdminSidebarSectionState, AdminSidebarState, } from './admin-sidebar.reducer';
import { hasValue } from '../../shared/empty.util';
import { map } from 'rxjs/operators';
import {
  AdminSidebarSectionCollapseAllAction,
  AdminSidebarSectionToggleAction,
  AdminSidebarToggleAction
} from './admin-sidebar.actions';
import { AppState, keySelector } from '../../app.reducer';
import { slideSidebar } from '../../shared/animations/slide';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { rotateInOut } from '../../shared/animations/rotate';

const sidebarSectionStateSelector = (state: AppState) => state.adminSidebar.sections;
const sidebarStateSelector = (state) => state.adminSidebar;

const sectionByNameSelector = (name: string): MemoizedSelector<AppState, AdminSidebarSectionState> => {
  return keySelector<AdminSidebarSectionState>(name, sidebarSectionStateSelector);
};

@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideSidebar, rotateInOut]
})
export class AdminSidebarComponent implements OnInit {
  sidebarCollapsed: Observable<boolean>;
  sidebarWidth: Observable<string>;
  sidebarActive = true;

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
    // Is sidebar closing?
    if (this.sidebarActive) {
      this.sidebarActive = false;
      this.store.dispatch(new AdminSidebarSectionCollapseAllAction());
    }
    this.store.dispatch(new AdminSidebarToggleAction());
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.sidebarActive = true;
    }
  }
}
