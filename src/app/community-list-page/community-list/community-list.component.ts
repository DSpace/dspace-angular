import {Component, OnInit} from '@angular/core';
import {CommunityListService} from '../CommunityListService';
import {CommunityFlatNode, CommunityListDataSource} from '../CommunityListDataSource';
import {FlatTreeControl} from '@angular/cdk/tree';

@Component({
  selector: 'ds-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.css']
})
export class CommunityListComponent implements OnInit {

  treeControl = new FlatTreeControl<CommunityFlatNode>(
      (node) => node.level, (node) => node.expandable
  );

  dataSource: CommunityListDataSource;

  constructor(private communityListService: CommunityListService) { }

  ngOnInit() {
    this.dataSource = new CommunityListDataSource(this.communityListService);
    this.dataSource.loadCommunities();
  }

  hasChild = (_: number, node: CommunityFlatNode) => node.expandable;

  shouldRender(node: CommunityFlatNode) {
    const parent = node.parent;
    return !parent || parent.isExpanded;
  }

  numberReturn(length){
    return new Array(length);
  }

}
