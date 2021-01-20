import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Tab } from '../../core/layout/models/tab.model';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { TabDataService } from '../../core/layout/tab-data.service';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getCrisLayoutTab } from '../decorators/cris-layout-tab.decorator';
import { CrisLayoutPage } from '../decorators/cris-layout-page.decorator';
import { CrisLayoutPage as CrisLayoutPageObj } from '../models/cris-layout-page.model';
import { LayoutPage } from '../enums/layout-page.enum';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthService } from '../../core/auth/auth.service';

/**
 * This component defines the default layout for all DSpace Items.
 * This component can be overwritten for a specific Item type using
 * CrisLayoutPage decorator
 */
@Component({
  selector: 'ds-cris-layout-default',
  templateUrl: './cris-layout-default.component.html',
  styleUrls: ['./cris-layout-default.component.scss']
})
@CrisLayoutPage(LayoutPage.DEFAULT)
export class CrisLayoutDefaultComponent extends CrisLayoutPageObj implements OnInit, OnDestroy {

  /**
   * Reference of this Component
   */
  componentRef: ComponentRef<Component>;

  /**
   * A boolean representing if to render or not the sidebar menu
   */
  private hasSidebar$: Observable<boolean>;

  /**
   * This parameter define the status of sidebar (hide/show)
   */
  private sidebarStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Tabs
   */
  private tabs$: Observable<Tab[]>;

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  constructor(
    private tabService: TabDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    // Retrieve tabs by UUID of item
    this.tabs$ = this.tabService.findByItem(this.item.id).pipe(
      getFirstSucceededRemoteListPayload()
    );

    // Check if to show sidebar
    this.hasSidebar$ = this.tabs$.pipe(
      map((tabs) => isNotEmpty(tabs) && tabs.length > 1)
    );

    // Init the sidebar status
    this.hasSidebar$.pipe(take(1)).subscribe((status) => {
      this.sidebarStatus$.next(status)
    });
  }

  /**
   * It is used for hide/show the left sidebar
   */
  toggleSidebar(): void {
    this.sidebarStatus$.next(!this.sidebarStatus$.value);
  }

  /**
   * Set dynamic child component
   */
  changeTab(tab: Tab) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent(tab.shortname));
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as any).item = this.item;
    (this.componentRef.instance as any).tab = tab;
  }

  /**
   * Fetch the component depending on the item type and shortname of tab
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(tabShortname: string): GenericConstructor<Component> {
    return getCrisLayoutTab(this.item, tabShortname);
  }

  /**
   * Return list of tabs
   */
  getTabs(): Observable<Tab[]> {
    return this.tabs$;
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
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

}
