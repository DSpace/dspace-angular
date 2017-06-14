import {
    Component, Input, ViewEncapsulation, ChangeDetectionStrategy,
    OnInit
} from '@angular/core';
import { RemoteData } from "../core/data/remote-data";
import { DSpaceObject } from "../core/shared/dspace-object.model";
import { PaginationOptions } from "../core/cache/models/pagination-options.model";
import { PageInfo } from "../core/shared/page-info.model";
import { Observable } from "rxjs";


@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'ds-object-list',
    styleUrls: ['./object-list.component.css'],
    templateUrl: './object-list.component.html'
})
export class ObjectListComponent implements OnInit {

    @Input() objects: RemoteData<DSpaceObject[]>;
    @Input() config : PaginationOptions;
    pageInfo : Observable<PageInfo>;
    data: any = {};

    constructor() {
        this.universalInit();
    }

    universalInit() {
    }

    ngOnInit(): void {
        this.pageInfo = this.objects.pageInfo;
    }

}
