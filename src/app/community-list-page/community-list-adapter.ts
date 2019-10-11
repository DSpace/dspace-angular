import {Injectable} from '@angular/core';
import {combineLatest as observableCombineLatest} from 'rxjs/internal/observable/combineLatest';
import {Observable, of as observableOf} from 'rxjs';
import {CommunityDataService} from '../core/data/community-data.service';
import {PaginationComponentOptions} from '../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../core/cache/models/sort-options.model';
import {catchError, filter, map, switchMap, take} from 'rxjs/operators';
import {Community} from '../core/shared/community.model';
import {Collection} from '../core/shared/collection.model';
import {hasValue, isNotEmpty} from '../shared/empty.util';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list';

export interface FlatNode {
    isExpandable: boolean;
    name: string;
    id: string;
    level: number;
    isExpanded?: boolean;
    parent?: FlatNode;
    payload: Community | Collection;
}

export const combineAndFlatten = (obsList: Array<Observable<FlatNode[]>>): Observable<FlatNode[]> =>
    observableCombineLatest(...obsList).pipe(
        map((matrix: FlatNode[][]) =>
            matrix.reduce((combinedList, currentList: FlatNode[]) => [...combinedList, ...currentList]))
    );

export const toFlatNode = (
    c: Community | Collection,
    level: number,
    isExpanded: boolean,
    parent?: FlatNode
): FlatNode => ({
    isExpandable: c instanceof Community,
    name: c.name,
    id: c.id,
    level: level,
    isExpanded,
    parent,
    payload: c,
});

@Injectable()
export class CommunityListAdapter {

    communities$: Observable<Community[]>;

    config: PaginationComponentOptions;
    sortConfig: SortOptions;

    constructor(private cds: CommunityDataService) {
        this.config = new PaginationComponentOptions();
        this.config.id = 'top-level-pagination';
        this.config.pageSize = 50;
        this.config.currentPage = 1;
        this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
        this.initTopCommunityList()
    }

    private initTopCommunityList(): void {
        this.communities$ = this.cds.findTop({
            currentPage: this.config.currentPage,
            elementsPerPage: this.config.pageSize,
            sort: {field: this.sortConfig.field, direction: this.sortConfig.direction}
        }).pipe(
            take(1),
            map((results) => results.payload.page),
        );
    }

    loadCommunities(expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        return this.communities$
            .pipe(
                take(1),
                switchMap((result: Community[]) => {
                    return this.transformListOfCommunities(result, 0, null, expandedNodes);
                }),
                catchError(() => observableOf([]))
            );
    };

    private transformListOfCommunities(listOfCommunities: Community[],
                                       level: number,
                                       parent: FlatNode,
                                       expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        if (isNotEmpty(listOfCommunities)) {
            const obsList = listOfCommunities
                .map((community: Community) =>
                    this.transformCommunity(community, level, parent, expandedNodes));

            return combineAndFlatten(obsList);
        } else {
            return observableOf([]);
        }
    }

    private transformCommunity(community: Community, level: number, parent: FlatNode, expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        let isExpanded = false;
        if (isNotEmpty(expandedNodes)) {
            isExpanded = hasValue(expandedNodes.find((node) => (node.id === community.id)));
        }

        const communityFlatNode = toFlatNode(community, level, isExpanded, parent);

        let obsList = [observableOf([communityFlatNode])];

        if (isExpanded) {
            const subCommunityNodes$ = community.subcommunities.pipe(
                filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
                take(1),
                switchMap((rd: RemoteData<PaginatedList<Community>>) =>
                    this.transformListOfCommunities(rd.payload.page, level + 1, communityFlatNode, expandedNodes))
            );

            obsList = [...obsList, subCommunityNodes$];

            const collectionNodes$ = community.collections.pipe(
                filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
                take(1),
                map((rd: RemoteData<PaginatedList<Collection>>) =>
                    rd.payload.page
                        .map((collection: Collection) => toFlatNode(collection, level + 1, false, parent))
                )
            );

            obsList = [...obsList, collectionNodes$];
        }

        return combineAndFlatten(obsList);
    }

}
