import {
  Component,
  Input,
} from '@angular/core';

import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../../abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../abstract-component-loader/dynamic-component-loader.directive';
import { MenuID } from '../menu-id.model';
import { getComponentForMenu } from '../menu-section.decorator';
import { MenuSection } from '../menu-section.model';

@Component({
  selector: 'ds-menu-component-loader',
  templateUrl: '../../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class MenuComponentLoaderComponent extends AbstractComponentLoaderComponent<Component> {

  /**
   * Whether the menu is expandable
   */
  @Input() expandable: boolean;

  /**
   * The ID of the Menu
   */
  @Input() menuID: MenuID;

  /**
   * The section data
   */
  @Input() section: MenuSection;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'expandable',
    'menuID',
  ];

  protected inputNames: (keyof this & string)[] = [
    'expandable',
    'menuID',
    'section',
  ];

  public getComponent(): Promise<GenericConstructor<Component>> {
    return getComponentForMenu(this.menuID, this.expandable, this.themeService.getThemeName());
  }

}
