import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy } from '@angular/core';
import { Tab } from 'src/app/core/layout/models/tab.model';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { TabDataService } from 'src/app/core/layout/tab-data.service';
import { getFirstSucceededRemoteListPayload } from 'src/app/core/shared/operators';
import { GenericConstructor } from 'src/app/core/shared/generic-constructor';
import { getCrisLayoutTab } from '../decorators/cris-layout-tab.decorator';
import { CrisLayoutPage } from '../decorators/cris-layout-page.decorator';
import { CrisLayoutPage as CrisLayoutPageObj } from '../models/cris-layout-page.model';
import { LayoutPage } from '../enums/layout-page.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { hasValue } from 'src/app/shared/empty.util';

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
   * This parameter define the status of sidebar (hide/show)
   */
  sidebarStatus = false;
  /**
   * Tabs
   */
  tabs: Tab[];
  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  componentRef: ComponentRef<Component>;

  constructor(
    private tabService: TabDataService,
    public cd: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    // Retrieve tabs by UUID of item
    this.tabService.findByItem(this.item.id)
      .pipe(getFirstSucceededRemoteListPayload())
      .subscribe(
        (next) => {
          this.tabs = next;
          if (hasValue(this.tabs) && this.tabs.length > 0) {
            this.cd.markForCheck();
          }
        }
    );
  }

  /**
   * It is used for hide/show the left sidebar
   */
  hideShowSidebar(): void {
    this.sidebarStatus = !this.sidebarStatus;
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

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
