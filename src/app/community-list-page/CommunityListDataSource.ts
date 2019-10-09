import {CommunityForList, CommunityListService} from './CommunityListService';
import {CollectionViewer, DataSource} from '@angular/cdk/typings/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';

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

    loadCommunities() {
        this.loadingSubject.next(true);

        this.communityListService.getCommunityList()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false)),
                map((result: CommunityForList[]) => {
                    const communityFlatNodes: CommunityFlatNode[] = [];
                    const level = 0;
                    return this.transformListOfCommunities(result, level, communityFlatNodes, null);
                })
            )
            .subscribe((communityFlatNode) => {
                this.communityListSubject.next(communityFlatNode)
            });
    };

    transformListOfCommunities(listOfCommunities: CommunityForList[],
                               level: number,
                               communityFlatNodes: CommunityFlatNode[],
                               parent: CommunityFlatNode): CommunityFlatNode[] {
        level++;
        for (const community of listOfCommunities) {
            const hasSubComs = ((!!community.subcoms && community.subcoms.length > 0));
            const communityFlatNode: CommunityFlatNode = {
                expandable: hasSubComs,
                name: community.name,
                level: level,
                isExpanded: false,
                community: community,
                parent: parent
            }
            communityFlatNodes.push(communityFlatNode);
            if (hasSubComs) {
                this.transformListOfCommunities(community.subcoms, level, communityFlatNodes, communityFlatNode);
            }
        }
        return communityFlatNodes;
    }

}
