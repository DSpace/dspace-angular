import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from "../../../../core/shared/bitstream.model";
import { Item } from "../../../../core/shared/item.model";
import { Observable } from "rxjs";
import { FileSectionComponent } from "../../../simple/field-components/file-section/file-section.component";

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
    selector: 'ds-item-page-full-file-section',
    templateUrl: './full-file-section.component.html'
})
export class FullFileSectionComponent extends FileSectionComponent implements OnInit {

    @Input() item: Item;

    files: Observable<Array<Observable<Bitstream>>>;

    thumbnails: Map<string,  Observable<Bitstream>> = new Map();


    universalInit() {
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.files.subscribe(
            files =>
                files.forEach(
                    file => {
                        file.subscribe(
                            original => {
                                const thumbnail : Observable<Bitstream> = this.item.getThumbnailForOriginal(file);
                                thumbnail.subscribe(t =>
                                    console.log("TESTTTT" , t));
                                this.thumbnails.set(original.id, thumbnail);
                            }
                        );
                    }
                )
        )
    }

}
