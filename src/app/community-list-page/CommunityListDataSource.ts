import {CommunityListService} from './CommunityListService';
import {CollectionViewer, DataSource} from '@angular/cdk/typings/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, filter, finalize, map, take, tap} from 'rxjs/operators';
import {Community} from '../core/shared/community.model';
import {Collection} from '../core/shared/collection.model';
import {hasValue, isEmpty} from '../shared/empty.util';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list';

export interface FlatNode {
    expandable: boolean;
    name: string;
    handle: string;
    level: number;
    isExpanded?: boolean;
    parent?: FlatNode;
    community: Community;
}

export class CommunityListDataSource implements DataSource<FlatNode> {

    private communityListSubject = new BehaviorSubject<FlatNode[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private communityListService: CommunityListService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
        return this.communityListSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.communityListSubject.complete();
        this.loadingSubject.complete();
    }

    loadCommunities(expandedNodes: FlatNode[]) {
        this.loadingSubject.next(true);

        this.communityListService.getCommunityList()
            .pipe(
                filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
                take(1),
                finalize(() => this.loadingSubject.next(false)),
            )
            .subscribe((result) => {
                const communities = result.payload.page;
                const flatNodes = this.transformListOfCommunities(communities, -1, [], null, expandedNodes);
                this.communityListSubject.next(flatNodes)
            });
    };

    transformListOfCommunities(listOfCommunities: Community[],
                               level: number,
                               flatNodes: FlatNode[],
                               parent: FlatNode,
                               expandedNodes: FlatNode[]): FlatNode[] {
        level++;
        if (hasValue(listOfCommunities)) {
            for (const community of listOfCommunities) {
                let expanded = false;
                if (hasValue(expandedNodes)) {
                    const expandedNodesFound = expandedNodes.filter((node) => (node.handle === community.handle));
                    expanded = (expandedNodesFound.length > 0);
                }
                const communityFlatNode: FlatNode = {
                    expandable: true,
                    name: community.name,
                    handle: community.handle,
                    level: level,
                    isExpanded: expanded,
                    parent: parent,
                    community: community,
                }
                flatNodes.push(communityFlatNode);
                if (expanded) {
                    let subcoms: Community[] = [];
                    community.subcommunities.pipe(
                        tap((v) => console.log('subcom tap', v)),
                        filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
                        take(1),)
                        .subscribe((results) => {
                            subcoms = results.payload.page;
                            if (!isEmpty(subcoms)) {
                                this.transformListOfCommunities(subcoms, level, flatNodes, communityFlatNode, expandedNodes);
                            }
                    });
                    let coll: Collection[] = [];
                    community.collections.pipe(
                        tap((v) => console.log('col tap ' ,v)),
                        filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
                        take(1),
                        )
                        .subscribe((results) => {
                        coll = results.payload.page;
                        for (const collection of coll) {
                            const collectionFlatNode: FlatNode = {
                                expandable: false,
                                name: collection.name,
                                handle: collection.handle,
                                level: level,
                                isExpanded: false,
                                parent: parent,
                                community: community,
                            }
                            flatNodes.push(collectionFlatNode);
                        }
                    });
                }
            }
        }
        return flatNodes;
    }

}
