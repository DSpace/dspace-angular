import {Component, OnInit} from '@angular/core';
import {CommunityListAdapter, FlatNode} from '../community-list-adapter';
import {CommunityListDatasource} from '../community-list-datasource';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Collection} from '../../core/shared/collection.model';
import {Community} from '../../core/shared/community.model';
import {isEmpty} from "../../shared/empty.util";

@Component({
    selector: 'ds-community-list',
    templateUrl: './community-list.component.html',
    styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

    private expandedNodes: FlatNode[] = [];
    private Arr = Array;

    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level, (node) => node.isExpandable
    );

    dataSource: CommunityListDatasource;

    constructor(private communityListAdapter: CommunityListAdapter) {
    }

    ngOnInit() {
        this.dataSource = new CommunityListDatasource(this.communityListAdapter);
        this.dataSource.loadCommunities(null);
    }

    hasChild(_: number, node: FlatNode) {
        return node.isExpandable;
    }

    isShowMore(_: number, node: FlatNode) {
        return node.isShowMoreNode;
    }

    toggleExpanded(node: FlatNode) {
        if (node.isExpanded) {
            this.expandedNodes = this.expandedNodes.filter((node2) => node2.name !== node.name);
            node.isExpanded = false;
        } else {
            this.expandedNodes.push(node);
            node.isExpanded = true;
            if (isEmpty(node.currentCollectionPage)) {
                node.currentCollectionPage = 1;
            }
            if (isEmpty(node.currentCommunityPage)) {
                node.currentCommunityPage = 1;
            }
        }
        this.dataSource.loadCommunities(this.expandedNodes);
    }

    getNextPage(node: FlatNode): void {
        if (node.parent != null) {
            if (node.parent.isExpandable) {
                if (node.payload instanceof Collection) {
                    const parentNodeInExpandedNodes = this.expandedNodes.find((node2:FlatNode) => node.parent.id === node2.id);
                    parentNodeInExpandedNodes.currentCollectionPage++;
                }
                if (node.payload instanceof Community) {
                    const parentNodeInExpandedNodes = this.expandedNodes.find((node2:FlatNode) => node.parent.id === node2.id);
                    parentNodeInExpandedNodes.currentCommunityPage++;
                }
            }
            this.dataSource.loadCommunities(this.expandedNodes);
        } else {
            this.communityListAdapter.getNextPageTopCommunities();
            this.dataSource.loadCommunities(this.expandedNodes);
        }
    }

}
