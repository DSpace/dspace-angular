import {
  Component,
  Inject,
  Input,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DynamicLayoutTypeConfig } from '@dspace/config/layout-config.interfaces';

import { DynamicLayoutTab } from '../../core/layout/models/tab.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Item } from '../../core/shared/item.model';
import { AbstractComponentLoaderComponent } from '../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { getDynamicLayoutPage } from '../decorators/dynamic-layout-page.decorator';
import { LayoutPage } from '../enums/layout-page.enum';

/**
 * Loader component that dynamically instantiates the correct layout page component
 * (horizontal or vertical) based on the entity type's configuration in the app config.
 *
 * Extends {@link AbstractComponentLoaderComponent} to leverage automatic input/output
 * wiring and re-instantiation when dependent inputs change.
 */
@Component({
  selector: 'ds-dynamic-layout-loader',
  templateUrl: '../../shared/abstract-component-loader/abstract-component-loader.component.html',
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class DynamicLayoutLoaderComponent extends AbstractComponentLoaderComponent<Component> {

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
   * Leading tabs passed through to the dynamic child component
   */
  @Input() leadingTabs: DynamicLayoutTab[];

  /**
   * Input names that should be passed down to the dynamically created component.
   */
  protected inputNames: (keyof this & string)[] = [
    'item', 'tabs', 'showContextMenu', 'leadingTabs',
  ];

  /**
   * When `item` changes, the component must be re-evaluated because
   * the layout orientation depends on the item's entity type.
   */
  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'item',
  ];

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected themeService: ThemeService,
  ) {
    super(themeService);
  }

  /**
   * Resolve the layout configuration for the current item's entity type.
   * Falls back to the 'default' configuration if no entity-specific config is found.
   *
   * @returns The layout type configuration for the item
   */
  getConfiguration(): DynamicLayoutTypeConfig {
    const itemType = this.item?.firstMetadataValue('dspace.entity.type');
    const def = 'default';

    if (this.appConfig.layout?.itemPage?.[itemType]) {
      return this.appConfig.layout.itemPage[itemType];
    }
    return this.appConfig.layout.itemPage[def];
  }

  /**
   * Fetch the component depending on the item's entity type layout configuration.
   * Called by the abstract base class when instantiating or re-instantiating the component.
   *
   * @returns The constructor of the layout page component (horizontal or vertical)
   */
  public getComponent(): Promise<GenericConstructor<Component>> {
    const configuration = this.getConfiguration();
    return getDynamicLayoutPage(configuration.orientation as LayoutPage);
  }
}
