import { Component, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { environment } from '../../../environments/environment';
import { CrisLayoutTypeConfig } from '../../../config/layout-config.interfaces';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getCrisLayoutPage } from '../decorators/cris-layout-page.decorator';

@Component({
  selector: 'ds-cris-layout-loader',
  templateUrl: './cris-layout-loader.component.html',
  styleUrls: ['./cris-layout-loader.component.scss']
})
export class CrisLayoutLoaderComponent implements OnInit, OnDestroy {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Tabs to render
   */
  @Input() tabs: CrisLayoutTab[];

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;

  /**
   * Configuration layout form the environment
   */
  layoutConfiguration: CrisLayoutTypeConfig;


  @Input() leadingTabs: CrisLayoutTab[];

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, { static: true }) crisLayoutLoader: CrisLayoutLoaderDirective;

  /**
   * componentRef reference of the component that will be created
   */
  componentRef: ComponentRef<Component>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.getConfiguration();
    this.initComponent();
  }

  /**
   * Get tabs for the specific item and the configuration for the item
   */
  getConfiguration(): void {
    const itemType = this.item ?.firstMetadataValue('dspace.entity.type');
    const def = 'default';

    if (!!environment.crisLayout.itemPage && !!environment.crisLayout.itemPage[itemType]) {
      this.layoutConfiguration = environment.crisLayout.itemPage[itemType];
    } else {
      this.layoutConfiguration = environment.crisLayout.itemPage[def];
    }
  }

  /**
   * Initialize the component depending the layout configuration
   */
  initComponent(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.getComponent());
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as any).item = this.item;
    (this.componentRef.instance as any).tabs = this.tabs;
    (this.componentRef.instance as any).showContextMenu = this.showContextMenu;
    (this.componentRef.instance as any).leadingTabs = this.leadingTabs;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Fetch the component depending on the item
   * @returns {GenericConstructor<Component>}
   */
  private getComponent(): GenericConstructor<Component> {
    return getCrisLayoutPage(this.layoutConfiguration.orientation);
  }

  /**
   * Destroy componentRef when this component is destroyed
   */
  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
