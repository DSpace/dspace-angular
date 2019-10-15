import {Injectable} from '@angular/core';
import {combineLatest as observableCombineLatest} from 'rxjs/internal/observable/combineLatest';
import {Observable, of, of as observableOf} from 'rxjs';
import {CommunityDataService} from '../core/data/community-data.service';
import {PaginationComponentOptions} from '../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../core/cache/models/sort-options.model';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {Community} from '../core/shared/community.model';
import {Collection} from '../core/shared/collection.model';
import {hasValue, isNotEmpty} from '../shared/empty.util';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list';
import {getCommunityPageRoute} from "../+community-page/community-page-routing.module";
import {getCollectionPageRoute} from "../+collection-page/collection-page-routing.module";

export interface FlatNode {
    isExpandable: boolean;
    name: string;
    id: string;
    level: number;
    isExpanded?: boolean;
    parent?: FlatNode;
    payload: Community | Collection;
    isShowMoreNode: boolean;
    route?: string;
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
    isShowMoreNode: false,
    route: c instanceof Community ? getCommunityPageRoute(c.id) : getCollectionPageRoute(c.id),
});

export const showMoreFlatNode = (
    c: Community | Collection,
    level: number,
    parent?: FlatNode
): FlatNode => ({
    isExpandable: false,
    name: c.name,
    id: c.id,
    level: level,
    isExpanded: false,
    parent: parent,
    payload: c,
    isShowMoreNode: true,
});

@Injectable()
export class CommunityListAdapter {

    payload$: Observable<PaginatedList<Community>>;

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
        this.payload$ = this.cds.findTop({
            currentPage: this.config.currentPage,
            elementsPerPage: this.config.pageSize,
            sort: {field: this.sortConfig.field, direction: this.sortConfig.direction}
        }).pipe(
            take(1),
            map((results) => results.payload),
        );
    }

    loadCommunities(expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        return this.payload$
            .pipe(
                take(1),
                switchMap((result: PaginatedList<Community>) => {
                    return this.transformListOfCommunities(result, 0, null, expandedNodes);
                }),
                catchError(() => observableOf([])),
                tap((results) => console.log('endload', results)),
            );
    };

    private transformListOfCommunities(listOfPaginatedCommunities: PaginatedList<Community>,
                                       level: number,
                                       parent: FlatNode,
                                       expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        if (isNotEmpty(listOfPaginatedCommunities.page)) {
            const isNotAllCommunities = (listOfPaginatedCommunities.totalElements > listOfPaginatedCommunities.elementsPerPage);
            let obsList = listOfPaginatedCommunities.page
                .map((community: Community) =>
                    this.transformCommunity(community, level, parent, expandedNodes, isNotAllCommunities));

            if (isNotAllCommunities) {
                obsList = [...obsList, this.addPossibleShowMoreComunityFlatNode(level, parent)];
            }

            return combineAndFlatten(obsList);
        } else {
            return observableOf([]);
        }
    }

    private transformCommunity(community: Community, level: number, parent: FlatNode, expandedNodes: FlatNode[], isNotAllCommunities: boolean): Observable<FlatNode[]> {
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
                    this.transformListOfCommunities(rd.payload, level + 1, communityFlatNode, expandedNodes))
            );

            obsList = [...obsList, subCommunityNodes$];

            const collectionNodes$ = community.collections.pipe(
                filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
                take(1),
                tap((results) => console.log('collectionstap', results)),
                map((rd: RemoteData<PaginatedList<Collection>>) => {
                        let nodes$ = rd.payload.page
                            .map((collection: Collection) => toFlatNode(collection, level + 1, false, parent));
                        if (rd.payload.elementsPerPage < rd.payload.totalElements) {
                            nodes$ = [...nodes$, this.addPossibleShowMoreCollectionFlatNode(level + 1, parent)];
                        }
                        return nodes$;
                }
                )
            );
            obsList = [...obsList, collectionNodes$];
        }

        return combineAndFlatten(obsList);
    }

    private addPossibleShowMoreComunityFlatNode(level: number, parent: FlatNode): Observable<FlatNode[]> {
        const dummyCommunity = Object.assign(new Community(), {
            id: '999999',
            metadata: {
                'dc.title': [
                    { language: 'en_US', value: 'Test' }
                ]
            }
        })
        return of([showMoreFlatNode(dummyCommunity, level, parent)]);
    }

    private addPossibleShowMoreCollectionFlatNode(level: number, parent: FlatNode): FlatNode {
        const dummyCollection = Object.assign(new Collection(), {
            id: '999999',
            metadata: {
                'dc.title': [
                    { language: 'en_US', value: 'Test' }
                ]
            }
        })
        return showMoreFlatNode(dummyCollection, level, parent);
    }

}
