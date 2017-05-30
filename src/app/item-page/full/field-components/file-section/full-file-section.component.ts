import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from "../../../../core/shared/bitstream.model";
import { Item } from "../../../../core/shared/item.model";
import { Observable } from "rxjs";
import { FileSectionComponent } from "../../../simple/field-components/file-section/file-section.component";
import { hasValue } from "../../../../shared/empty.util";

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
    selector: 'ds-item-page-full-file-section',
    styleUrls: ['./full-file-section.component.css'],
    templateUrl: './full-file-section.component.html'
})
export class FullFileSectionComponent extends FileSectionComponent {

    @Input() item: Item;

    label : string;

    files: Observable<Bitstream[]>;


    thumbnails: Map<string,  Observable<Bitstream>> = new Map();


    universalInit() {
    }

    initialize(): void {
        const originals = this.item.getFiles("ORIGINAL");
        const licenses = this.item.getFiles("LICENSE");
        licenses.subscribe(licenses => console.log(licenses));
        this.files = Observable.combineLatest(originals, licenses, (originals, licenses) => [...originals, ...licenses]);
        this.files.subscribe(
            files =>
                files.forEach(
                    original => {
                        const thumbnail: Observable<Bitstream> = this.item.getThumbnailForOriginal(original);
                        this.thumbnails.set(original.id, thumbnail);
                    }
                )
        )
    }

}
