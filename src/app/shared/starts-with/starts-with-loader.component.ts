import {
  Component,
  Input,
} from '@angular/core';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../abstract-component-loader/abstract-component-loader.component';
import { StartsWithAbstractComponent } from './starts-with-abstract.component';
import { getStartsWithComponent } from './starts-with-decorator';
import { StartsWithType } from './starts-with-type';

/**
 * Component for loading a {@link StartsWithAbstractComponent} depending on the "type" input
 */
@Component({
  selector: 'ds-starts-with-loader',
  templateUrl: '../abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
})
export class StartsWithLoaderComponent extends AbstractComponentLoaderComponent<StartsWithAbstractComponent> {

  @Input() paginationId: string;

  @Input() startsWithOptions: (string | number)[];

  @Input() type: StartsWithType;

  protected inputNames: (keyof this & string)[] = [
    ...this.inputNames,
    'paginationId',
    'startsWithOptions',
    'type',
  ];

  public getComponent(): GenericConstructor<StartsWithAbstractComponent> {
    return getStartsWithComponent(this.type);
  }

}
