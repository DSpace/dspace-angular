import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CommunityDataService} from '../core/data/community-data.service';
import {PaginationComponentOptions} from '../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../core/cache/models/sort-options.model';
import { map, take, tap } from 'rxjs/operators';
import {Community} from '../core/shared/community.model';

@Injectable()
export class CommunityListService {

    communities$: Observable<Community[]>;

    config: PaginationComponentOptions;
    sortConfig: SortOptions;

    constructor(private cds: CommunityDataService) {
        this.config = new PaginationComponentOptions();
        this.config.id = 'top-level-pagination';
        this.config.pageSize = 10;
        this.config.currentPage = 1;
        this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
        this.initTopCommunityList()
    }

    private initTopCommunityList(): void {
        this.communities$ = this.cds.findTop({
            currentPage: this.config.currentPage,
            elementsPerPage: this.config.pageSize,
            sort: { field: this.sortConfig.field, direction: this.sortConfig.direction }
        }).pipe(
          take(1),
          map((results) => results.payload.page),
        );
    }

}
