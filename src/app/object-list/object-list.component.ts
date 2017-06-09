import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { RemoteData } from "../core/data/remote-data";
import { DSpaceObject } from "../core/shared/dspace-object.model";
import { PaginationOptions } from "../core/cache/models/pagination-options.model";


@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'ds-object-list',
    styleUrls: ['./object-list.component.css'],
    templateUrl: './object-list.component.html'
})
export class ObjectListComponent {

    @Input() objects: RemoteData<DSpaceObject[]>;
    @Input() config : PaginationOptions;
    data: any = {};

    constructor() {
        this.universalInit();
    }

    universalInit() {

    }

}
