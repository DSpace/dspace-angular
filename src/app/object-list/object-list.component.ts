import {
    Component, Input, ViewEncapsulation, ChangeDetectionStrategy,
    OnInit, Output
} from '@angular/core';
import { RemoteData } from "../core/data/remote-data";
import { DSpaceObject } from "../core/shared/dspace-object.model";
import { PageInfo } from "../core/shared/page-info.model";
import { Observable } from "rxjs";
import { PaginationComponentOptions } from "../shared/pagination/pagination-component-options.model";
import { EventEmitter } from "@angular/common/src/facade/async";
import { SortOptions } from "../core/cache/models/sort-options.model";


@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.Emulated,
    selector: 'ds-object-list',
    styleUrls: ['./object-list.component.css'],
    templateUrl: './object-list.component.html'
})
export class ObjectListComponent implements OnInit {

    @Input() objects: RemoteData<DSpaceObject[]>;
    @Input() config : PaginationComponentOptions;
    @Input() sortConfig : SortOptions;
    pageInfo : Observable<PageInfo>;

    @Output() pageChange = new EventEmitter();
    @Output() pageSizeChange = new EventEmitter();
    @Output() sortDirectionChange = new EventEmitter();
    @Output() sortFieldChange = new EventEmitter();
    data: any = {};

    constructor() {
        this.universalInit();
    }

    universalInit() {
    }

    ngOnInit(): void {
        this.pageInfo = this.objects.pageInfo;
    }

    onPageChange(event) {
        this.pageChange.emit(event);
    }

    onPageSizeChange(event) {
        this.pageSizeChange.emit(event);
    }

    onSortDirectionChange(event) {
        this.sortDirectionChange.emit(event);
    }

    onSortFieldChange(event) {
        this.sortFieldChange.emit(event);
    }

}
