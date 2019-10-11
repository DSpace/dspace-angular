import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommunityDataService} from '../core/data/community-data.service';
import {PaginationComponentOptions} from '../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../core/cache/models/sort-options.model';
import {Community} from '../core/shared/community.model';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list';

@Injectable()
export class CommunityListService {

    communities: Community[];

    config: PaginationComponentOptions;
    sortConfig: SortOptions;

    constructor(private cds: CommunityDataService) {
        this.config = new PaginationComponentOptions();
        this.config.id = 'top-level-pagination';
        this.config.pageSize = 100;
        this.config.currentPage = 1;
        this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    }

    public getCommunityList(): Observable<RemoteData<PaginatedList<Community>>>  {
        return this.cds.findTop({
            currentPage: this.config.currentPage,
            elementsPerPage: this.config.pageSize,
            sort: { field: this.sortConfig.field, direction: this.sortConfig.direction }
        });
    }

}
