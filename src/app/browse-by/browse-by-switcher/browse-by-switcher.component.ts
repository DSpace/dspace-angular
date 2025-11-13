import {
  Component,
  Input,
} from '@angular/core';
import { BrowseByDataType } from '@dspace/core/browse/browse-by-data-type';
import { Context } from '@dspace/core/shared/context.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';

import { AbstractComponentLoaderComponent } from '../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { getComponentByBrowseByType } from './browse-by-decorator';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: '../../shared/abstract-component-loader/abstract-component-loader.component.html',
  imports: [
    DynamicComponentLoaderDirective,
  ],
  standalone: true,
})
export class BrowseBySwitcherComponent extends AbstractComponentLoaderComponent<Component> {

  @Input() context: Context;

  @Input() browseByType: { type: BrowseByDataType };

  @Input() displayTitle: boolean;

  @Input() scope: string;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'context',
    'browseByType',
  ];

  protected inputNames: (keyof this & string)[] = [
    'context',
    'browseByType',
    'displayTitle',
    'scope',
  ];

  public getComponent(): GenericConstructor<Component> {
    return getComponentByBrowseByType(this.browseByType.type, this.context, this.themeService.getThemeName());
  }

}
