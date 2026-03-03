import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../../shared/theme-support/themed.component';
import { GeospatialItemPageFieldComponent } from './geospatial-item-page-field.component';

@Component({
  selector: 'ds-geospatial-item-page-field',
  templateUrl: '../../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    GeospatialItemPageFieldComponent,
  ],
})
export class ThemedGeospatialItemPageFieldComponent extends ThemedComponent<GeospatialItemPageFieldComponent> {

  @Input() item: Item;

  @Input() label: string;

  @Input() pointFields: string[];

  @Input() bboxFields: string[];

  @Input() cluster: boolean;

  protected inAndOutputNames: (keyof GeospatialItemPageFieldComponent & keyof this)[] = [
    'item',
    'label',
    'pointFields',
    'bboxFields',
    'cluster',
  ];

  protected getComponentName(): string {
    return 'GeospatialItemPageFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/item-page/simple/field-components/specific-field/geospatial/geospatial-item-page-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./geospatial-item-page-field.component');
  }

}
