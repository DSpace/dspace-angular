import {
  Component,
  Input,
} from '@angular/core';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../abstract-component-loader/dynamic-component-loader.directive';
import { getStartsWithComponent } from './starts-with-decorator';
import { StartsWithType } from './starts-with-type';

/**
 * Component for loading a {@link StartsWithAbstractComponent} depending on the "type" input
 */
@Component({
  selector: 'ds-starts-with-loader',
  templateUrl: '../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class StartsWithLoaderComponent extends AbstractComponentLoaderComponent<Component> {

  @Input() paginationId: string;

  @Input() startsWithOptions: (string | number)[];

  @Input() type: StartsWithType;

  protected inputNames: (keyof this & string)[] = [
    ...this.inputNames,
    'paginationId',
    'startsWithOptions',
    'type',
  ];

  public getComponent(): Promise<GenericConstructor<Component>> {
    return getStartsWithComponent(this.type, this.themeService.getThemeName());
  }

}
