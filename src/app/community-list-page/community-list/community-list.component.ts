import {Component, OnInit} from '@angular/core';
import {CommunityListService} from '../CommunityListService';
import {FlatNode, CommunityListDataSource} from '../CommunityListDataSource';
import {FlatTreeControl} from '@angular/cdk/tree';

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

  dataSource: CommunityListDataSource;

  constructor(private communityListService: CommunityListService) { }

  ngOnInit() {
    this.dataSource = new CommunityListDataSource(this.communityListService);
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

}
