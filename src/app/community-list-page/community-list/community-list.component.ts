import {Component, OnInit} from '@angular/core';
import {CommunityListAdapter, FlatNode} from '../community-list-adapter';
import {CommunityListDatasource} from '../community-list-datasource';
import {FlatTreeControl} from '@angular/cdk/tree';
import {getCollectionPageRoute} from '../../+collection-page/collection-page-routing.module';
import {getCommunityPageRoute} from '../../+community-page/community-page-routing.module';

@Component({
    selector: 'ds-community-list',
    templateUrl: './community-list.component.html',
    styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

    private expandedNodes: FlatNode[] = [];

    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level, (node) => node.isExpandable
    );

    dataSource: CommunityListDatasource;

    constructor(private communityListService: CommunityListAdapter) {
    }

    ngOnInit() {
        this.dataSource = new CommunityListDatasource(this.communityListService);
        this.dataSource.loadCommunities(null);
    }

    hasChild = (_: number, node: FlatNode) => node.isExpandable;

    shouldRender(node: FlatNode) {
        const parent = node.parent;
        return !parent || parent.isExpanded;
    }

    toggleExpanded(node: FlatNode) {
        if (node.isExpanded) {
            this.expandedNodes = this.expandedNodes.filter((node2) => node2.name !== node.name);
            node.isExpanded = false;
        } else {
            this.expandedNodes.push(node);
            node.isExpanded = true;
        }
        this.dataSource.loadCommunities(this.expandedNodes);
    }

    getCollectionRoute(node: FlatNode): string {
        return getCollectionPageRoute(node.id);
    }

    getCommunityRoute(node: FlatNode): string {
        return getCommunityPageRoute(node.id);
    }

}
