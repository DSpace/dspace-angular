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
} from '../../../config/app-config.interface';
import { CrisLayoutTypeConfig } from '../../../config/layout-config.interfaces';
import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Item } from '../../core/shared/item.model';
import { getCrisLayoutPage } from '../decorators/cris-layout-page.decorator';
import { CrisLayoutLoaderDirective } from '../directives/cris-layout-loader.directive';
import { LayoutPage } from '../enums/layout-page.enum';

@Component({
  selector: 'ds-cris-layout-loader',
  templateUrl: './cris-layout-loader.component.html',
  styleUrls: ['./cris-layout-loader.component.scss'],
  standalone: true,
  imports: [CrisLayoutLoaderDirective],
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

    if (!!this.appConfig.crisLayout.itemPage && !!this.appConfig.crisLayout.itemPage[itemType]) {
      this.layoutConfiguration = this.appConfig.crisLayout.itemPage[itemType];
    } else {
      this.layoutConfiguration = this.appConfig.crisLayout.itemPage[def];
    }
  }

  /**
   * Initialize the component depending on the layout configuration
   */
  initComponent(): void {
    const component: GenericConstructor<Component> = this.getComponent();
    const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
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
    return getCrisLayoutPage(this.layoutConfiguration.orientation as LayoutPage);
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
