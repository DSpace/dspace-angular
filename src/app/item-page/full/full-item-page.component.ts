import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { ItemPageComponent } from "../simple/item-page.component";
import { Metadatum } from "../../core/shared/metadatum.model";
import { ItemDataService } from "../../core/data/item-data.service";
import { ActivatedRoute } from "@angular/router";
import { RemoteData } from "../../core/data/remote-data";
import { Item } from "../../core/shared/item.model";

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
    selector: 'ds-full-item-page',
    styleUrls: ['./full-item-page.component.css'],
    templateUrl: './full-item-page.component.html',
})
export class FullItemPageComponent extends ItemPageComponent {

    item: RemoteData<Item>;

    metadata: Observable<Array<Metadatum>>;

    constructor(route: ActivatedRoute, items: ItemDataService) {
        super(route, items);
    }

    universalInit() {

    }

    initialize(params) {
        super.initialize(params);
        this.metadata = this.item.payload.map(i => i.metadata);
    }

}
