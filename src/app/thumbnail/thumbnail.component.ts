import { Component, Input } from '@angular/core';
import { Bitstream } from "../core/shared/bitstream.model";
import { Observable } from "rxjs";

@Component({
    selector: 'ds-thumbnail',
    styleUrls: ['./thumbnail.component.css'],
    templateUrl: './thumbnail.component.html'
})
export class ThumbnailComponent {

    @Input() thumbnail : Observable<Bitstream>;
    data: any = {};

    constructor() {
        this.universalInit();

    }

    universalInit() {

    }

}
