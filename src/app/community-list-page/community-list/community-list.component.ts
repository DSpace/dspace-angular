import {
  CdkTreeModule,
  FlatTreeControl,
} from '@angular/cdk/tree';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { isEmpty } from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { TruncatableComponent } from '../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../shared/truncatable/truncatable-part/truncatable-part.component';
import { CommunityListDatasource } from '../community-list-datasource';
import { CommunityListService } from '../community-list-service';
import { FlatNode } from '../flat-node.model';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-base-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CdkTreeModule,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class CommunityListComponent implements OnInit, OnDestroy {

  private expandedNodes: FlatNode[] = [];
  public loadingNode: FlatNode;

  treeControl = new FlatTreeControl<FlatNode>(
    (node: FlatNode) => node.level, (node: FlatNode) => true,
  );
  dataSource: CommunityListDatasource;
  paginationConfig: FindListOptions;
  trackBy = (index, node: FlatNode) => node.id;

  constructor(
    protected communityListService: CommunityListService,
    public dsoNameService: DSONameService,
  ) {
    this.paginationConfig = new FindListOptions();
    this.paginationConfig.elementsPerPage = 2;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.sort = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnInit() {
    this.dataSource = new CommunityListDatasource(this.communityListService);
    this.communityListService.getLoadingNodeFromStore().pipe(take(1)).subscribe((result) => {
      this.loadingNode = result;
    });
    this.communityListService.getExpandedNodesFromStore().pipe(take(1)).subscribe((result) => {
      this.expandedNodes = [...result];
      this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
    });
  }

  ngOnDestroy(): void {
    this.communityListService.saveCommunityListStateToStore(this.expandedNodes, this.loadingNode);
  }

  /**
   * Whether this node has children (subcommunities or collections)
   * @param _
   * @param node
   */
  hasChild(_: number, node: FlatNode) {
    return node.isExpandable$;
  }

  /**
   * Whether this is a show more node that contains no data, but indicates that there is
   * one or more community or collection.
   * @param _
   * @param node
   */
  isShowMore(_: number, node: FlatNode) {
    return node.isShowMoreNode;
  }

  /**
   * Toggles the expanded variable of a node, adds it to the expanded nodes list and reloads the tree
   * so this node is expanded
   * @param node  Node we want to expand
   */
  toggleExpanded(node: FlatNode) {
    this.loadingNode = node;
    if (node.isExpanded) {
      this.expandedNodes = this.expandedNodes.filter((node2) => node2.id !== node.id);
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
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
  }

  /**
   * Makes sure the next page of a node is added to the tree (top community, sub community of collection)
   *      > Finds its parent (if not top community) and increases its corresponding collection/subcommunity
   *      currentPage
   *      > Reloads tree with new page added to corresponding top community lis, sub community list or
   *      collection list
   * @param node  The show more node indicating whether it's an increase in top communities, sub communities
   *              or collections
   */
  getNextPage(node: FlatNode): void {
    this.loadingNode = node;
    if (node.parent != null) {
      if (node.id.startsWith('collection')) {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCollectionPage++;
      }
      if (node.id.startsWith('community')) {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCommunityPage++;
      }
    } else {
      this.paginationConfig.currentPage++;
    }
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
  }

}
