import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CrisLayoutTab } from '../../../../core/layout/models/tab.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../core/shared/item.model';

import { CrisLayoutTabsComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';

@Component({
  selector: 'ds-cris-layout-sidebar',
  templateUrl: './cris-layout-sidebar.component.html',
  styleUrls: ['./cris-layout-sidebar.component.scss']
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
  private hasSidebar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public location: Location, public router: Router, public route: ActivatedRoute) {
    super(location, router, route);
  }

  ngOnInit(): void {
    this.init();
    // Check if to show sidebar
    this.hasSidebar$.next(!!this.tabs && this.tabs.length > 1);

    if (!this.hasSidebar$.value && !!this.tabs && this.tabs.length === 1) {
      this.selectTabEv(this.tabs[0]);
    }

    // Init the sidebar status
    this.sidebarStatus$.next(this.hasSidebar$.value);
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
      map((status: boolean) => !status)
    );
  }


  /**
   * It is used for hide/show the left sidebar
   */
  toggleSidebar(): void {
    this.sidebarStatus$.next(!this.sidebarStatus$.value);
  }
}
