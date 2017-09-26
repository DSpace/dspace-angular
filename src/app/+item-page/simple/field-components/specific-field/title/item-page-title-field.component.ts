import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageSpecificFieldComponent } from '../item-page-specific-field.component';

@Component({
    selector: 'ds-item-page-title-field',
    templateUrl: './item-page-title-field.component.html'
})
export class ItemPageTitleFieldComponent extends ItemPageSpecificFieldComponent {

    @Input() item: Item;

    separator: string;

    fields: string[] = [
        'dc.title'
    ];

}
