import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../../../core/shared/item.model";
import { Observable } from "rxjs";
import { ItemPageSpecificFieldComponent } from "../item-page-specific-field.component";

@Component({
    selector: 'ds-item-page-title-field',
    templateUrl: './item-page-title-field.component.html'
})
export class ItemPageTitleFieldComponent extends ItemPageSpecificFieldComponent implements OnInit {

    @Input() item: Observable<Item>;

    fields : string[] = [
        "dc.title"
    ];

}
