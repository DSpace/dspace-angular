import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { Context } from '../../../../modules/core/src/lib/core/shared/context.model';
import { GenericConstructor } from '../../../../modules/core/src/lib/core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { BrowseByDataType } from '../../../../modules/core/src/lib/core/shared/browse-by-data-type';
import { getComponentByBrowseByType } from './browse-by-decorator';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: '../../shared/abstract-component-loader/abstract-component-loader.component.html',
  imports: [AsyncPipe, NgComponentOutlet, DynamicComponentLoaderDirective],
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
