import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Context } from '../../../../core/shared/context.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { AbstractComponentLoaderComponent } from '../../../../shared/abstract-component-loader/abstract-component-loader.component';
import { DynamicComponentLoaderDirective } from '../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { DsoEditMetadataValue } from '../../dso-edit-metadata-form';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';
import { getDsoEditMetadataValueFieldComponent } from './dso-edit-metadata-value-field.decorator';

/**
 * A component responsible for dynamically loading and rendering the appropriate edit metadata value field components
 * based on the type of the metadata field ({@link EditMetadataValueFieldType}) and the place where it's used
 * ({@link Context}).
 */
@Component({
  selector: 'ds-dso-edit-metadata-value-field-loader',
  templateUrl: '../../../../shared/abstract-component-loader/abstract-component-loader.component.html',
  standalone: true,
  imports: [
    DynamicComponentLoaderDirective,
  ],
})
export class DsoEditMetadataValueFieldLoaderComponent extends AbstractComponentLoaderComponent<Component> {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link DSpaceObject}
   */
  @Input() dso: DSpaceObject;

  /**
   * The type of the DSO, used to determines i18n messages
   */
  @Input() dsoType: string;

  /**
   * The type of the field
   */
  @Input() type: EditMetadataValueFieldType;

  /**
   * The metadata field
   */
  @Input() mdField: string;

  /**
   * Editable metadata value to show
   */
  @Input() mdValue: DsoEditMetadataValue;

  /**
   * Emits when the user clicked confirm
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  protected inputNamesDependentForComponent: (keyof this & string)[] = [
    'context',
    'type',
  ];

  protected inputNames: (keyof this & string)[] = [
    'context',
    'dso',
    'dsoType',
    'type',
    'mdField',
    'mdValue',
  ];

  protected outputNames: (keyof this & string)[] = [
    'confirm',
  ];

  public getComponent(): GenericConstructor<Component> {
    return getDsoEditMetadataValueFieldComponent(this.type, this.context, this.themeService.getThemeName());
  }

}
