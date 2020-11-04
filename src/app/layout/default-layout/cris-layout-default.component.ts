import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, startWith, take } from 'rxjs/operators';

import { Tab } from '../../core/layout/models/tab.model';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { TabDataService } from '../../core/layout/tab-data.service';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getCrisLayoutTab } from '../decorators/cris-layout-tab.decorator';
import { CrisLayoutPage } from '../decorators/cris-layout-page.decorator';
import { CrisLayoutPage as CrisLayoutPageObj } from '../models/cris-layout-page.model';
import { LayoutPage } from '../enums/layout-page.enum';
import { isNotEmpty } from '../../shared/empty.util';
import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { EditItem } from '../../core/submission/models/edititem.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { EditItemMode } from '../../core/submission/models/edititem-mode.model';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';

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
   * List of Edit Modes available on this item
   * for the current user
   */
  private editModes$: BehaviorSubject<EditItemMode[]> = new BehaviorSubject<EditItemMode[]>([]);

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
    public cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private editItemService: EditItemDataService,
    private authorizationService: AuthorizationDataService
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

    // Retrieve edit modes
    this.editItemService.findById(this.item.id + ':none', followLink('modes')).pipe(
      getAllSucceededRemoteDataPayload(),
      mergeMap((editItem: EditItem) => editItem.modes.pipe(
        getFirstSucceededRemoteListPayload())
      ),
      startWith([])
    ).subscribe((editModes: EditItemMode[]) => {
      this.editModes$.next(editModes)
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
   * Check if edit mode is available
   */
  getEditModes(): Observable<EditItemMode[]> {
    return this.editModes$;
  }

  /**
   * Return list of tabs
   */
  getTabs(): Observable<Tab[]> {
    return this.tabs$;
  }

  /**
   * Check if edit mode is available
   */
  isEditAvailable(): Observable<boolean> {
    return this.editModes$.asObservable().pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.length === 1)
    );
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
   * Return if the user is the administrator
   */
  isAdministrator() {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

}
