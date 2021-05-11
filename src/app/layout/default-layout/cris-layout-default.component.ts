import {
  ChangeDetectorRef,
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { Tab } from '../../core/layout/models/tab.model';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { TabDataService } from '../../core/layout/tab-data.service';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload
} from '../../core/shared/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getCrisLayoutTab } from '../decorators/cris-layout-tab.decorator';
import { CrisLayoutPage } from '../decorators/cris-layout-page.decorator';
import { CrisLayoutPageModelComponent as CrisLayoutPageObj } from '../models/cris-layout-page.model';
import { LayoutPage } from '../enums/layout-page.enum';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthService } from '../../core/auth/auth.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { followLink } from '../../shared/utils/follow-link-config.model';

/**
 * This component defines the default layout for all DSpace Items.
 * This component can be overwritten for a specific Item type using
 * CrisLayoutPageModelComponent decorator
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
   * Reference to the selected tab.
   * @private
   */
  protected selectedTab: Tab;

  private unsubscribe$ = new Subject<void>();

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  constructor(
    protected tabService: TabDataService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected authService: AuthService,
    protected itemService: ItemDataService,
    protected changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroyTab();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeComponent() {
    // Retrieve tabs by UUID of item
    this.tabs$ = this.tabService.findByItem(this.item.id, false).pipe(
      getFirstSucceededRemoteListPayload()
    );

    // Check if to show sidebar
    this.hasSidebar$ = this.tabs$.pipe(
      map((tabs) => isNotEmpty(tabs) && tabs.length > 1)
    );

    // Init the sidebar status
    this.hasSidebar$.pipe(take(1)).subscribe((status) => {
      this.sidebarStatus$.next(status);
    });
  }

  /**
   * Instantiate the Tab component.
   * @param viewContainerRef
   * @param componentFactory
   * @param tab
   */
  instantiateTab(viewContainerRef: ViewContainerRef, componentFactory: ComponentFactory<any>, tab: Tab): ComponentRef<any> {
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as any).item = this.item;
    (componentRef.instance as any).tab = tab;
    (componentRef.instance as any).refreshTab.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.refreshTab();
    });
    return componentRef;
  }



  destroyTab() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
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
    this.selectedTab = tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent(tab.shortname));
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();
    this.destroyTab();
    this.componentRef = this.instantiateTab(viewContainerRef, componentFactory, tab);
  }


  /**
   * Fetch the component depending on the item type and shortname of tab
   * @returns {GenericConstructor<Component>}
   */
  protected getComponent(tabShortname: string): GenericConstructor<Component> {
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

  /**
   * Refresh the tab.
   * @protected
   */
  refreshTab() {
    this.destroyTab();
    this.refreshItem().subscribe(() => {
      this.initializeComponent();
      this.changeDetector.detectChanges();
    });
  }

  /**
   * Refresh the item instance of this page, without a route change.
   * This is the same call performed by the page resolver.
   */
  refreshItem(): Observable<Item> {
    return this.itemService.findById(this.item.id,
      false, true,
      followLink('owningCollection'),
      followLink('bundles'),
      followLink('relationships'),
      followLink('version', undefined, true, true, true,
        followLink('versionhistory')),
    ).pipe(getFirstSucceededRemoteDataPayload(), tap((item: Item) => (this.item = item)));
  }



}
