import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-title-field',
    templateUrl: './item-page-title-field.component.html'
})
export class ItemPageTitleFieldComponent extends ItemPageFieldComponent {

    @Input() item: Item;

    separator: string;

    fields: string[] = [
        'dc.title'
    ];

}
