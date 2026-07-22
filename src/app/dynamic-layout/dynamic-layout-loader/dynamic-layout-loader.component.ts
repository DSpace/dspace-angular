import {
  Component,
  ComponentRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DynamicLayoutTypeConfig } from '@dspace/config/layout-config.interfaces';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Item } from '../../core/shared/item.model';
import { getDynamicLayoutPage } from '../decorators/dynamic-layout-page.decorator';
import { DynamicLayoutLoaderDirective } from '../directives/dynamic-layout-loader.directive';
import { LayoutPage } from '../enums/layout-page.enum';

/**
 * Loader component that dynamically instantiates the correct layout page component
 * (horizontal or vertical) based on the entity type's configuration in the app config.
 *
 * Uses the {@link DynamicLayoutLoaderDirective} as a ViewChild anchor to place the
 * dynamically created component, passing the item, tabs, and context menu settings.
 */
@Component({
  selector: 'ds-dynamic-layout-loader',
  templateUrl: './dynamic-layout-loader.component.html',
  styleUrls: ['./dynamic-layout-loader.component.scss'],
  imports: [
    DynamicLayoutLoaderDirective,
  ],
})
export class DynamicLayoutLoaderComponent implements OnInit, OnDestroy {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Tabs to render
   */
  @Input() tabs: DynamicLayoutTab[];

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;

  /**
   * Layout type configuration (orientation) resolved from the app config for the item's entity type.
   */
  layoutConfiguration: DynamicLayoutTypeConfig;


  @Input() leadingTabs: DynamicLayoutTab[];

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(DynamicLayoutLoaderDirective, { static: true }) dynamicLayoutLoader: DynamicLayoutLoaderDirective;

  /**
   * componentRef reference of the component that will be created
   */
  componentRef: ComponentRef<Component>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
  }

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

    if (!!this.appConfig.layout.itemPage && !!this.appConfig.layout.itemPage[itemType]) {
      this.layoutConfiguration = this.appConfig.layout.itemPage[itemType];
    } else {
      this.layoutConfiguration = this.appConfig.layout.itemPage[def];
    }
  }

  /**
   * Initialize the component depending on the layout configuration
   */
  initComponent(): void {
    const component: GenericConstructor<Component> = this.getComponent();
    const viewContainerRef = this.dynamicLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(component);
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
    return getDynamicLayoutPage(this.layoutConfiguration.orientation as LayoutPage);
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
