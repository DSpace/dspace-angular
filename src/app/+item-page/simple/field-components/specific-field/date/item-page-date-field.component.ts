import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-date-field',
    templateUrl: '../item-page-field.component.html'
})
export class ItemPageDateFieldComponent extends ItemPageFieldComponent {

    @Input() item: Item;

    separator = ', ';

    fields: string[] = [
        'dc.date.issued'
    ];

    label = 'item.page.date';

}
