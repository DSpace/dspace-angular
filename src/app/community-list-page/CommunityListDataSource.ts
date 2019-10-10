import {CommunityForList, CommunityListService} from './CommunityListService';
import {CollectionViewer, DataSource} from '@angular/cdk/typings/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map, take} from 'rxjs/operators';

export interface CommunityFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    isExpanded?: boolean;
    parent?: CommunityFlatNode;
    community: CommunityForList;
}

export class CommunityListDataSource implements DataSource<CommunityFlatNode> {

    private communityListSubject = new BehaviorSubject<CommunityFlatNode[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private communityListService: CommunityListService) {}

    connect(collectionViewer: CollectionViewer): Observable<CommunityFlatNode[]> {
        return this.communityListSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.communityListSubject.complete();
        this.loadingSubject.complete();
    }

    loadCommunities(expandedNodes: CommunityFlatNode[]) {
        this.loadingSubject.next(true);

        this.communityListService.getCommunityList()
            .pipe(
                take(1),
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                map((result: CommunityForList[]) => {
                    const communityFlatNodes: CommunityFlatNode[] = [];
                    const level = 0;
                    return this.transformListOfCommunities(result, level, communityFlatNodes, null, expandedNodes);
                })
            )
            .subscribe((communityFlatNode) => {
                this.communityListSubject.next(communityFlatNode)
            });
    };

    transformListOfCommunities(listOfCommunities: CommunityForList[],
                               level: number,
                               communityFlatNodes: CommunityFlatNode[],
                               parent: CommunityFlatNode,
                               expandedNodes: CommunityFlatNode[]): CommunityFlatNode[] {
        level++;
        for (const community of listOfCommunities) {
            const hasSubComs = ((!!community.subcoms && community.subcoms.length > 0));
            let expanded = false;
            if (expandedNodes != null) {
                const expandedNodesFound = expandedNodes.filter((node) => (node.name === community.name));
                expanded = (expandedNodesFound.length > 0);
            }
            console.log(community.name + 'is expanded: ' + expanded);
            const communityFlatNode: CommunityFlatNode = {
                expandable: hasSubComs,
                name: community.name,
                level: level,
                isExpanded: expanded,
                community: community,
                parent: parent
            }
            communityFlatNodes.push(communityFlatNode);
            if (hasSubComs && communityFlatNode.isExpanded) {
                this.transformListOfCommunities(community.subcoms, level, communityFlatNodes, communityFlatNode, expandedNodes);
            }
        }
        return communityFlatNodes;
    }

}
