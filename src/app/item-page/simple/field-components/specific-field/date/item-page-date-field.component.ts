import { Component, Input } from '@angular/core';
import { Item } from "../../../../../core/shared/item.model";
import { ItemPageSpecificFieldComponent } from "../item-page-specific-field.component";

@Component({
    selector: 'ds-item-page-date-field',
    templateUrl: './../item-page-specific-field.component.html'
})
export class ItemPageDateFieldComponent extends ItemPageSpecificFieldComponent {

    @Input() item: Item;

    separator : string = ", ";

    fields : string[] = [
        "dc.date.issued"
    ];

    label : string = "item.page.date";

}
