import {Injectable} from '@angular/core';
import {combineLatest as observableCombineLatest} from 'rxjs/internal/observable/combineLatest';
import {merge, Observable, of, of as observableOf} from 'rxjs';
import {CommunityDataService} from '../core/data/community-data.service';
import {PaginationComponentOptions} from '../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../core/cache/models/sort-options.model';
import {catchError, defaultIfEmpty, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {Community} from '../core/shared/community.model';
import {Collection} from '../core/shared/collection.model';
import {hasValue, isEmpty, isNotEmpty} from '../shared/empty.util';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list';
import {getCommunityPageRoute} from '../+community-page/community-page-routing.module';
import {getCollectionPageRoute} from '../+collection-page/collection-page-routing.module';
import {CollectionDataService} from '../core/data/collection-data.service';

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
    currentCommunityPage?: number;
    currentCollectionPage?: number;
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

    payloads$: Array<Observable<PaginatedList<Community>>>;

    topCommunitiesConfig: PaginationComponentOptions;
    topCommunitiesSortConfig: SortOptions;

    maxSubCommunitiesPerPage: number;

    constructor(private communityDataService: CommunityDataService, private collectionDataService: CollectionDataService) {
        this.topCommunitiesConfig = new PaginationComponentOptions();
        this.topCommunitiesConfig.id = 'top-level-pagination';
        this.topCommunitiesConfig.pageSize = 10;
        this.topCommunitiesConfig.currentPage = 1;
        this.topCommunitiesSortConfig = new SortOptions('dc.title', SortDirection.ASC);
        this.initTopCommunityList()

        this.maxSubCommunitiesPerPage = 3;
    }

    private initTopCommunityList(): void {
        this.payloads$ = [this.communityDataService.findTop({
            currentPage: this.topCommunitiesConfig.currentPage,
            elementsPerPage: this.topCommunitiesConfig.pageSize,
            sort: {field: this.topCommunitiesSortConfig.field, direction: this.topCommunitiesSortConfig.direction}
        }).pipe(
            take(1),
            map((results) => results.payload),
        )];

    }

    getNextPageTopCommunities(): void {
        this.topCommunitiesConfig.currentPage = this.topCommunitiesConfig.currentPage + 1;
        this.payloads$ = [...this.payloads$, this.communityDataService.findTop({
                currentPage: this.topCommunitiesConfig.currentPage,
                elementsPerPage: this.topCommunitiesConfig.pageSize,
                sort: {field: this.topCommunitiesSortConfig.field, direction: this.topCommunitiesSortConfig.direction}
            }).pipe(
                take(1),
                map((results) => results.payload),
            )];
    }

    loadCommunities(expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        const res = this.payloads$.map((payload) => {
            return payload.pipe(
                take(1),
                switchMap((result: PaginatedList<Community>) => {
                    return this.transformListOfCommunities(result, 0, null, expandedNodes);
                }),
                catchError(() => observableOf([])),
            );
        });
        return combineAndFlatten(res);
    };

    private transformListOfCommunities(listOfPaginatedCommunities: PaginatedList<Community>,
                                       level: number,
                                       parent: FlatNode,
                                       expandedNodes: FlatNode[]): Observable<FlatNode[]> {
        if (isNotEmpty(listOfPaginatedCommunities.page)) {
            let currentPage = this.topCommunitiesConfig.currentPage;
            if (isNotEmpty(parent)) {
                currentPage = expandedNodes.find((node: FlatNode) => node.id === parent.id).currentCommunityPage;
            }
            const isNotAllCommunities = (listOfPaginatedCommunities.totalElements > (listOfPaginatedCommunities.elementsPerPage * currentPage));
            let obsList = listOfPaginatedCommunities.page
                .map((community: Community) => {
                    return this.transformCommunity(community, level, parent, expandedNodes)
                });
            if (isNotAllCommunities && listOfPaginatedCommunities.currentPage > currentPage) {
                obsList = [...obsList, this.addPossibleShowMoreComunityFlatNode(level, parent)];
            }

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
            const currentPage = expandedNodes.find((node: FlatNode) => node.id === community.id).currentCommunityPage;
            let subcoms$ = [];
            for (let i = 1; i <= currentPage ; i++) {
                const p = this.communityDataService.findSubCommunitiesPerParentCommunity(community.uuid,{elementsPerPage: this.maxSubCommunitiesPerPage, currentPage: i})
                    .pipe(
                        filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
                    take(1),
                        switchMap((rd: RemoteData<PaginatedList<Community>>) =>
                            this.transformListOfCommunities(rd.payload, level + 1, communityFlatNode, expandedNodes))

                    );
                subcoms$ = [...subcoms$, p];
            }

            obsList = [...obsList, combineAndFlatten(subcoms$)];

            // need to be authorized (logged in) to receive collections this way
            // const cols = this.collectionDataService.getAuthorizedCollectionByCommunity(community.uuid,{elementsPerPage: 2});
            // cols.pipe(take(1)).subscribe((val) => console.log('cols:', val));

            const collectionNodes$ = community.collections.pipe(
                filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
                take(1),
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
