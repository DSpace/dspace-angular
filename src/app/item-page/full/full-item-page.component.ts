import { Component, OnInit } from '@angular/core';
import { Item } from "../../core/shared/item.model";
import { RemoteData } from "../../core/data/remote-data";
import { Observable } from "rxjs";
import { Bitstream } from "../../core/shared/bitstream.model";
import { ItemPageComponent } from "../simple/item-page.component";
import { Metadatum } from "../../core/shared/metadatum.model";

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

    metadata: Array<Metadatum>;

    universalInit() {

    }

    initialize(params) {
        super.initialize(params);
        this.metadata = this.item.payload.flatMap(i => i.metadata);
    }

}
