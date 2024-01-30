import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { SEPARATOR } from '../../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-complex.model';


@Component({
  selector: 'ds-clarin-sponsor-item-field',
  templateUrl: './clarin-sponsor-item-field.component.html',
  styleUrls: ['./clarin-sponsor-item-field.component.scss']
})
export class ClarinSponsorItemFieldComponent {

  @Input() item: Item;

  PROJECT_CODE_ERROR = 'Error: Cannot load project code';
  ORGANIZATION_ERROR = 'Error: Cannot load organization';
  PROJECT_NAME_ERROR = 'Error: Cannot load project name';
  SPONSOR_VALUE_SEPARATOR = SEPARATOR;

  getValueOrError(value: string, defaultValue: string): string {
    return value ? value : defaultValue;
  }
}
