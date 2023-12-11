import { Component, Input } from '@angular/core';
import { getComponentByBrowseByType, BrowseByDataType } from './browse-by-decorator';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../../shared/abstract-component-loader/abstract-component-loader.component';
import { AbstractBrowseByTypeComponent } from '../abstract-browse-by-type.component';

@Component({
  selector: 'ds-browse-by-switcher',
  templateUrl: '../../shared/abstract-component-loader/abstract-component-loader.component.html'
})
export class BrowseBySwitcherComponent extends AbstractComponentLoaderComponent<AbstractBrowseByTypeComponent> {

  @Input() browseByType: BrowseByDataType;

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    ...this.inputNamesDependentForComponent,
    'browseByType',
  ];

  protected inputNames: (keyof this & string)[] = [
    ...this.inputNames,
    'browseByType',
  ];

  public getComponent(): GenericConstructor<AbstractBrowseByTypeComponent> {
    return getComponentByBrowseByType(this.browseByType, this.context, this.themeService.getThemeName());
  }

}
