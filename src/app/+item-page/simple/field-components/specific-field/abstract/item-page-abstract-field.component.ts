import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-abstract-field',
    templateUrl: '../item-page-field.component.html'
})
export class ItemPageAbstractFieldComponent extends ItemPageFieldComponent {

    @Input() item: Item;

    separator: string;

    fields: string[] = [
        'dc.description.abstract'
    ];

    label = 'item.page.abstract';

}
