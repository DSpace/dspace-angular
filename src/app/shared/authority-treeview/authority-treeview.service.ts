import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { flatMap, map, merge, scan } from 'rxjs/operators';
import { findIndex } from 'lodash';

import { LOAD_MORE_NODE, LOAD_MORE_ROOT_NODE, TreeviewFlatNode, TreeviewNode } from './authority-treeview-node.model';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { AuthorityService } from '../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../core/integration/integration-data';
import { PageInfo } from '../../core/shared/page-info.model';
import { isEmpty, isNotEmpty } from '../empty.util';

/**
 * A database that only load part of the data initially. After user clicks on the `Load more`
 * button, more data will be loaded.
 */
@Injectable()
export class AuthorityTreeviewService {

  /** The data */
  nodeMap = new Map<string, TreeviewNode>();
  storedNodeMap = new Map<string, TreeviewNode>();
  storedNodes: TreeviewNode[] = [];

  private authorityName = '';
  private dataChange = new BehaviorSubject<TreeviewNode[]>([]);
  private searching = new BehaviorSubject<boolean>(false);
  private hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.searching.next(false));

  constructor(private authorityService: AuthorityService) {
  }

  initialize(options: IntegrationSearchOptions): void {
    this.authorityName = options.name;
    this.getTopNodes(options, []);
  }

  getData(): Observable<TreeviewNode[]> {
    return this.dataChange
  }

  /** Expand a node whose children are not loaded */
  loadMoreRoot(node: TreeviewFlatNode) {
    const options = Object.assign(new IntegrationSearchOptions(null, this.authorityName), node.pageInfo);

    const nodes = this.dataChange.value;
    nodes.pop();
    this.getTopNodes(options, nodes);
  }

  loadMore(item: AuthorityEntry, onlyFirstTime = false) {
    if (!this.nodeMap.has(item.id)) {
      return;
    }
    const parent: TreeviewNode = this.nodeMap.get(item.id)!;
    const children = this.nodeMap.get(item.id)!.children || [];
    children.pop();
    this.getChildrenByParent(item.id, parent.pageInfo).subscribe((result: IntegrationData) => {

      if (onlyFirstTime && parent.children!.length > 0) {
        return;
      }

      const newNodes = result.payload as AuthorityEntry[];
      children.push(...newNodes
        .map((entry) => this._generateNode(entry))
      );

      if ((result.pageInfo.currentPage + 1) <= result.pageInfo.totalPages) {
        // Update page info
        const newPageInfo: PageInfo = Object.assign(new PageInfo(), result.pageInfo, {
          currentPage: result.pageInfo.currentPage + 1
        });
        parent.updatePageInfo(newPageInfo);

        // Need a new load more node
        children.push(new TreeviewNode(LOAD_MORE_NODE, false, newPageInfo, item));
      }
      parent.childrenChange.next(children);
      this.dataChange.next(this.dataChange.value);
    })

  }

  isSearching(): Observable<boolean> {
    return this.searching;
  }

  searchBy(options: IntegrationSearchOptions) {
    this.searching.next(true);
    if (isEmpty(this.storedNodes)) {
      this.storedNodes = this.dataChange.value;
      this.storedNodeMap = this.nodeMap;
    }
    this.nodeMap = new Map<string, TreeviewNode>();
    this.dataChange.next([]);

    this.authorityService.getEntriesByName(options).pipe(
      flatMap((result: IntegrationData) => (result.payload.length > 0) ? result.payload : observableOf(null)),
      flatMap((entry: AuthorityEntry) => this.getNodeHierarchy(options, entry)),
      scan((acc: TreeviewNode[], value: TreeviewNode) => {
        if (isEmpty(value) || findIndex(acc, (node) => node.item.id === value.item.id) !== -1) {
          return acc;
        } else {
          return [...acc, value]
        }
      }, []),
      merge(this.hideSearchingWhenUnsubscribed$)
    ).subscribe((nodes: TreeviewNode[]) => {
      this.dataChange.next(nodes);
      this.searching.next(false);
    })
  }

  restoreNodes() {
    this.searching.next(false);
    this.dataChange.next(this.storedNodes);
    this.nodeMap = this.storedNodeMap;

    this.storedNodeMap = new Map<string, TreeviewNode>();
    this.storedNodes = [];
  }

  private _generateNode(item: AuthorityEntry, isSearchNode = false): TreeviewNode {
    if (this.nodeMap.has(item.id)) {
      return this.nodeMap.get(item.id)!;
    }
    const entry: AuthorityEntry = Object.assign(new AuthorityEntry(), item);
    const hasChildren = entry.hasOtherInformation() && isNotEmpty((entry.otherInformation as any).children);
    const pageInfo: PageInfo = new PageInfo();
    const result = new TreeviewNode(entry, hasChildren, pageInfo, null, isSearchNode);

    this.nodeMap.set(entry.id, result);

    return result;
  }

  private getChildrenByParent(parentId: string, pageInfo: PageInfo): Observable<IntegrationData> {
    const options = Object.assign(new IntegrationSearchOptions(null, this.authorityName), pageInfo);
    return this.authorityService.findEntriesByParent(parentId, options);
  }

  private getById(options: IntegrationSearchOptions, parentId: string): Observable<AuthorityEntry> {
    options.query = parentId;
    return this.authorityService.getEntryByValue(options).pipe(
      map((result: IntegrationData) => result.payload[0] as AuthorityEntry)
    );
  }

  private getTopNodes(options: IntegrationSearchOptions, nodes: TreeviewNode[]) {
    this.authorityService.findTopEntries(options).pipe(
      map((response: IntegrationData) => ({
        pageInfo: response.pageInfo,
        payload: response.payload
          .map((entry: AuthorityEntry) => this._generateNode(entry))
      }))
    ).subscribe((result: any) => {
      nodes.push(...result.payload as TreeviewNode[]);
      if ((result.pageInfo.currentPage + 1) <= result.pageInfo.totalPages) {
        // Need a new load more node
        const newPageInfo: PageInfo = Object.assign(new PageInfo(), result.pageInfo, {
          currentPage: result.pageInfo.currentPage + 1
        });
        const loadMoreNode = new TreeviewNode(LOAD_MORE_ROOT_NODE, false, newPageInfo);
        loadMoreNode.updatePageInfo(newPageInfo);
        nodes.push(loadMoreNode);
      }
      // Notify the change.
      this.dataChange.next(nodes);
    });
  }

  private getNodeHierarchy(options: IntegrationSearchOptions, item: AuthorityEntry, children?: TreeviewNode[]): Observable<TreeviewNode> {
    if (isEmpty(item)) {
      return observableOf(null);
    }
    const node = this._generateNode(item, true);

    if (isNotEmpty(children)) {
      const newChildren = children
        .filter((entry: TreeviewNode) => {
          const ii = findIndex(node.children, (nodeEntry) => nodeEntry.item.id === entry.item.id);
          return ii === -1;
        });
      newChildren.forEach((entry: TreeviewNode) => {
        entry.loadMoreParentItem = node.item
      });
      node.children.push(...newChildren);
    }

    if (node.item.hasOtherInformation() && isNotEmpty(node.item.otherInformation.parent)) {
      return this.getById(options, node.item.otherInformation.parent).pipe(
        flatMap((parentItem) => this.getNodeHierarchy(options, parentItem, [node]))
      )
    } else {
      return observableOf(node);
    }
  }
}
