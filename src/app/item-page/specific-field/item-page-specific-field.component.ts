import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../../core/shared/item.model";
import { Observable } from "rxjs";

@Component({
    templateUrl: './item-page-specific-field.component.html'
})
export class ItemPageSpecificFieldComponent implements OnInit {

    @Input() item: Observable<Item>;

    fields : string[];
    label : string;
    separator : string = "<br/>";

    constructor() {
        this.universalInit();
    }

    universalInit() {

    }

    ngOnInit(): void {
    }


}
