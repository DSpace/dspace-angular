import {CommunityListService} from './CommunityListService';
import {CollectionViewer, DataSource} from '@angular/cdk/typings/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map, take, tap} from 'rxjs/operators';
import {Community} from '../core/shared/community.model';
import {Collection} from '../core/shared/collection.model';

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
                take(1),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                map((result: Community[]) => {
                    const flatNodes = this.transformListOfCommunities(result, 0, [], null, expandedNodes);
                    return flatNodes;
                })
            )
            .subscribe((flatNodes) => {
                this.communityListSubject.next(flatNodes)
            });
    };

    transformListOfCommunities(listOfCommunities: Community[],
                               level: number,
                               flatNodes: FlatNode[],
                               parent: FlatNode,
                               expandedNodes: FlatNode[]): FlatNode[] {
        level++;
        if (undefined !== listOfCommunities) {
            for (const community of listOfCommunities) {
                let expanded = false;
                if (expandedNodes != null) {
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
                    // TODO FIX: Retrieves last subcom or coll as undefined
                    let subcoms: Community[] = [];
                    community.subcommunities.pipe(
                        tap((v) => console.log('subcom tap', v)),
                        take(1)).subscribe((results) => {
                        subcoms = results.payload.page;
                        if (subcoms.length > 0) {
                            this.transformListOfCommunities(subcoms, level, flatNodes, communityFlatNode, expandedNodes);
                        }
                    });
                    let coll: Collection[] = [];
                    community.collections.pipe(
                        tap((v) => console.log('col tap ' ,v)),
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
