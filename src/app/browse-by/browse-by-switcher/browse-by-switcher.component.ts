import { Component, Input } from '@angular/core';
import { getComponentByBrowseByType } from './browse-by-decorator';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../../shared/abstract-component-loader/abstract-component-loader.component';
import { BrowseByDataType } from './browse-by-data-type';
import { Context } from '../../core/shared/context.model';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: '../../shared/abstract-component-loader/abstract-component-loader.component.html'
})
export class BrowseBySwitcherComponent extends AbstractComponentLoaderComponent<Component> {

  @Input() context: Context;

  @Input() browseByType: BrowseByDataType;

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
    return getComponentByBrowseByType(this.browseByType, this.context, this.themeService.getThemeName());
  }

}
