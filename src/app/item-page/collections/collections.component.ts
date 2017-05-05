import { Component, Input, OnInit } from '@angular/core';
import { Collection } from "../../core/shared/collection.model";
import { Observable } from "rxjs";
import { Item } from "../../core/shared/item.model";

@Component({
    selector: 'ds-item-page-collections',
    templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {

    @Input() item: Item;
    label : string = "item.page.collections";
    collections: Array<Observable<Collection>>;

    constructor() {
        this.universalInit();

    }

    universalInit() {
    }

    ngOnInit(): void {
        this.collections = this.item.getCollections();
        this.collections[0].subscribe(d => console.log("TEST TEST LOREM IPSUM LALALALAL"));
    }



}
