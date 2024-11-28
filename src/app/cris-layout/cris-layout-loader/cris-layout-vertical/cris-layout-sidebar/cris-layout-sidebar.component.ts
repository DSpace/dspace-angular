import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { Item } from '../../../../core/shared/item.model';
import { CrisLayoutTabsComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';
import { CrisLayoutSidebarItemComponent } from '../../shared/sidebar-item/cris-layout-sidebar-item.component';

@Component({
  selector: 'ds-cris-layout-sidebar',
  templateUrl: './cris-layout-sidebar.component.html',
  styleUrls: ['./cris-layout-sidebar.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    CrisLayoutSidebarItemComponent,
    AsyncPipe,
  ],
})
export class CrisLayoutSidebarComponent extends CrisLayoutTabsComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: CrisLayoutTab[];

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  /**
   * If the navigation bar should be visible or not
   */
  @Input() showNav: boolean;

  /**
   * The new tab selection event
   */
  @Output() selectedTabChange = new EventEmitter<CrisLayoutTab>();

  /**
   * A boolean representing if to render or not the sidebar menu
   */
  hasSidebar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isSideBarHidden$: Observable<boolean>;

  ngOnInit(): void {
    this.init();
    // Check if to show sidebar
    this.hasSidebar$.next(!!this.tabs && this.tabs.length > 1);

    if (!this.hasSidebar$.value && !!this.tabs && this.tabs.length === 1) {
      this.selectTabEv(this.tabs[0]);
    }

    // Init the sidebar status
    this.sidebarStatus$.next(this.hasSidebar$.value);
    this.isSideBarHidden$ = this.isSideBarHidden();
  }

  /**
   * Emit a new selectedTabChange Event
   * @param tab
   */
  selectTabEv(tab: CrisLayoutTab) {
    this.setActiveTab(tab);
  }

  emitSelected(selectedTab) {
    this.selectedTabChange.emit(selectedTab);
  }

  /**
   * Check if sidebar is present
   */
  hasSidebar(): Observable<boolean> {
    return this.hasSidebar$.asObservable();
  }

  /**
   * Return the sidebar status
   */
  isSideBarHidden(): Observable<boolean> {
    return this.sidebarStatus$.asObservable().pipe(
      map((status: boolean) => !status),
    );
  }


  /**
   * It is used for hide/show the left sidebar
   */
  toggleSidebar(): void {
    this.sidebarStatus$.next(!this.sidebarStatus$.value);
  }
}
