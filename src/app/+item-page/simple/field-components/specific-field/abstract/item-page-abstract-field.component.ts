import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageSpecificFieldComponent } from '../item-page-specific-field.component';

@Component({
    selector: 'ds-item-page-abstract-field',
    templateUrl: './../item-page-specific-field.component.html'
})
export class ItemPageAbstractFieldComponent extends ItemPageSpecificFieldComponent {

    @Input() item: Item;

    separator: string;

    fields: string[] = [
        'dc.description.abstract'
    ];

    label = 'item.page.abstract';

}
