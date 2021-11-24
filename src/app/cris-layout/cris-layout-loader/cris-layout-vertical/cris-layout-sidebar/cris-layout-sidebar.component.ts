import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tab } from '../../../../core/layout/models/tab.model';

@Component({
  selector: 'ds-cris-layout-sidebar',
  templateUrl: './cris-layout-sidebar.component.html',
  styleUrls: ['./cris-layout-sidebar.component.scss']
})
export class CrisLayoutSidebarComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  /**
   * A boolean representing if to render or not the sidebar menu
   */
  private hasSidebar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    // Check if to show sidebar
    this.hasSidebar$.next(!!this.tabs && this.tabs.length > 0);

    // Init the sidebar status
    this.sidebarStatus$.next(this.hasSidebar$.value);
  }

  getTabSelected(tab) {
    console.log(tab);
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
