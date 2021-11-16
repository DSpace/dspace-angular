import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../core/layout/models/tab.model';
import { BehaviorSubject, Observable, Subject, of as observableOf } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

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
  private hasSidebar$: Observable<boolean>;

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    // Check if to show sidebar
    this.hasSidebar$ = observableOf(!!this.tabs && this.tabs.length > 0);

    // Init the sidebar status
    this.hasSidebar$.pipe(take(1)).subscribe((status) => {
      this.sidebarStatus$.next(status);
    });
  }

  getTabSelected(tab) {
    console.log(tab);
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
