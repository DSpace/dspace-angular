import { Component, OnInit } from '@angular/core';
import { CommunityListService, FlatNode } from '../community-list-service';
import { CommunityListDatasource } from '../community-list-datasource';
import { FlatTreeControl } from '@angular/cdk/tree';
import { isEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-community-list',
  templateUrl: './community-list.component.html',
})
export class CommunityListComponent implements OnInit {

  private expandedNodes: FlatNode[] = [];
  public loadingNode: FlatNode;

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level, (node) => node.isExpandable
  );

  dataSource: CommunityListDatasource;

  constructor(private communityListService: CommunityListService) {
  }

  ngOnInit() {
    this.dataSource = new CommunityListDatasource(this.communityListService);
    this.dataSource.loadCommunities(null);
  }

  // whether or not this node has children (subcommunities or collections)
  hasChild(_: number, node: FlatNode) {
    return node.isExpandable;
  }

  // whether or not it is a show more node (contains no data, but is indication that there are more topcoms, subcoms or collections
  isShowMore(_: number, node: FlatNode) {
    return node.isShowMoreNode;
  }

  /**
   * Toggles the expanded variable of a node, adds it to the exapanded nodes list and reloads the tree so this node is expanded
   * @param node  Node we want to expand
   */
  toggleExpanded(node: FlatNode) {
    this.loadingNode = node;
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

  /**
   * Makes sure the next page of a node is added to the tree (top community, sub community of collection)
   *      > Finds its parent (if not top community) and increases its corresponding collection/subcommunity currentPage
   *      > Reloads tree with new page added to corresponding top community lis, sub community list or collection list
   * @param node  The show more node indicating whether it's an increase in top communities, sub communities or collections
   */
  getNextPage(node: FlatNode): void {
    this.loadingNode = node;
    if (node.parent != null) {
      if (node.parent.isExpandable) {
        if (node.id === 'collection') {
          const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
          parentNodeInExpandedNodes.currentCollectionPage++;
        }
        if (node.id === 'community') {
          const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
          parentNodeInExpandedNodes.currentCommunityPage++;
        }
      }
      this.dataSource.loadCommunities(this.expandedNodes);
    } else {
      this.communityListService.getNextPageTopCommunities();
      this.dataSource.loadCommunities(this.expandedNodes);
    }
  }

}
