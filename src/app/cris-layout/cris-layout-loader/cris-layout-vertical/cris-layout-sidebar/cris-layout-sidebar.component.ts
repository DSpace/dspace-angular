import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';
import { BehaviorSubject, Observable, Subject, of as observableOf } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { CrisLayoutTabsSidebarComponent } from '../../shared/cris-layout-tabs/cris-layout-tabs.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-cris-layout-sidebar',
  templateUrl: './cris-layout-sidebar.component.html',
  styleUrls: ['./cris-layout-sidebar.component.scss']
})
export class CrisLayoutSidebarComponent extends CrisLayoutTabsSidebarComponent implements OnInit {

  /**
   * Tabs to render
   */
  @Input() tabs: Tab[];

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  /**
   * Item that is being viewed
   */
  @Output() selectedTabChange = new EventEmitter<Tab>();

  /**
   * A boolean representing if to render or not the sidebar menu
   */
  private hasSidebar$: Observable<boolean>;

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public location: Location, public router: Router, public route: ActivatedRoute) {
    super(location,router,route);
  }

  ngOnInit(): void {
    this.init();
    // Check if to show sidebar
    this.hasSidebar$ = observableOf(!!this.tabs && this.tabs.length > 0);

    // Init the sidebar status
    this.hasSidebar$.pipe(take(1)).subscribe((status) => {
      this.sidebarStatus$.next(status);
    });
  }

  getTabSelected(tab: Tab) {
    this.selectedTabChange.emit(tab)
  }

  /**
   * Check if sidebar is present
   */
  hasSidebar(): Observable<boolean> {
    return this.hasSidebar$;
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
