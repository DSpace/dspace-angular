import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../../../core/shared/item.model";
import { ItemPageSpecificFieldComponent } from "../item-page-specific-field.component";

@Component({
    selector: 'ds-item-page-abstract-field',
    templateUrl: './../item-page-specific-field.component.html'
})
export class ItemPageAbstractFieldComponent extends ItemPageSpecificFieldComponent implements OnInit {

    @Input() item: Item;

    fields : string[] = [
        "dc.description.abstract"
    ];
    label : string = "item.page.abstract";

}
