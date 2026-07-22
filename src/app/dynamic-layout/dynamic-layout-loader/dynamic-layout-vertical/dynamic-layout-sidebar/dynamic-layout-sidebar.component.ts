import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DynamicLayoutTab } from '@dspace/core/layout/models/tab.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { DynamicLayoutTabsComponent } from '../../shared/dynamic-layout-tabs/dynamic-layout-tabs.component';
import { DynamicLayoutSidebarItemComponent } from '../../shared/sidebar-item/dynamic-layout-sidebar-item.component';

@Component({
  selector: 'ds-dynamic-layout-sidebar',
  templateUrl: './dynamic-layout-sidebar.component.html',
  styleUrls: ['./dynamic-layout-sidebar.component.scss'],
  imports: [
    AsyncPipe,
    DynamicLayoutSidebarItemComponent,
    NgClass,
  ],
})
export class DynamicLayoutSidebarComponent extends DynamicLayoutTabsComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: DynamicLayoutTab[];

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
  @Output() selectedTabChange = new EventEmitter<DynamicLayoutTab>();

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
  selectTabEv(tab: DynamicLayoutTab) {
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
