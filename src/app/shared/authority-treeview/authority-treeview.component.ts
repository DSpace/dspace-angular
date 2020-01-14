import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, find, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { hasValue, isEmpty, isNotEmpty } from '../empty.util';
import { isAuthenticated } from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';
import { AuthorityTreeviewService } from './authority-treeview.service';
import { LOAD_MORE, LOAD_MORE_ROOT, TreeviewFlatNode, TreeviewNode } from './authority-treeview-node.model';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { TranslateService } from '@ngx-translate/core';

/**
 * @title Tree with partially loaded data
 */
@Component({
  selector: 'ds-authority-treeview',
  templateUrl: './authority-treeview.component.html',
  styleUrls: ['./authority-treeview.component.scss']
})
export class AuthorityTreeviewComponent implements OnDestroy, OnInit {

  @Input() searchOptions: IntegrationSearchOptions;
  @Input() preloadLevel = 2;
  @Input() selectedItem: any = null;

  description: Observable<string>;
  nodeMap = new Map<string, TreeviewFlatNode>();
  storedNodeMap = new Map<string, TreeviewFlatNode>();
  treeControl: FlatTreeControl<TreeviewFlatNode>;
  treeFlattener: MatTreeFlattener<TreeviewNode, TreeviewFlatNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<TreeviewNode, TreeviewFlatNode>;
  searchText: string;
  searching: Observable<boolean>;
  private isAuthenticated: Observable<boolean>;
  private subs: Subscription[] = [];

  @Output() select: EventEmitter<AuthorityEntry> = new EventEmitter<AuthorityEntry>(null);

  constructor(
    public activeModal: NgbActiveModal,
    private authorityTreeviewService: AuthorityTreeviewService,
    private store: Store<CoreState>,
    private translate: TranslateService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<TreeviewFlatNode>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  getChildren = (node: TreeviewNode): Observable<TreeviewNode[]> => node.childrenChange;

  transformer = (node: TreeviewNode, level: number) => {
    const existingNode = this.nodeMap.get(node.item.id);

    if (existingNode && existingNode.item.id !== LOAD_MORE && existingNode.item.id !== LOAD_MORE_ROOT) {
      return existingNode;
    }

    const newNode: TreeviewFlatNode = new TreeviewFlatNode(
      node.item,
      level,
      node.hasChildren,
      node.pageInfo,
      node.loadMoreParentItem,
      node.isSearchNode,
      node.isInInitValueHierarchy
    );
    this.nodeMap.set(node.item.id, newNode);

    if ((((level + 1) < this.preloadLevel) && newNode.expandable) || newNode.isSearchNode || newNode.isInInitValueHierarchy) {
      if (!newNode.isSearchNode) {
        this.loadChildren(newNode);
      }
      this.treeControl.expand(newNode);
    }
    return newNode;
  };

  getLevel = (node: TreeviewFlatNode) => node.level;

  isExpandable = (node: TreeviewFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.expandable;

  isLoadMore = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.item.id === LOAD_MORE;

  isLoadMoreRoot = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.item.id === LOAD_MORE_ROOT;

  /** Load more nodes from data source */
  loadMore(item: AuthorityEntry) {
    this.authorityTreeviewService.loadMore(item);
  }

  loadMoreRoot(node: TreeviewFlatNode) {
    this.authorityTreeviewService.loadMoreRoot(node);
  }

  loadChildren(node: TreeviewFlatNode) {
    this.authorityTreeviewService.loadMore(node.item, true);
  }

  onSelect(item: AuthorityEntry) {
    this.select.emit(item);
    this.activeModal.close(item);
  }

  ngOnInit(): void {
    this.subs.push(
      this.authorityTreeviewService.getData().subscribe((data) => {
        this.dataSource.data = data;
      })
    );

    this.searchOptions = Object.assign(new IntegrationSearchOptions(), this.searchOptions);

    const descriptionLabel = 'tree.description.' + this.searchOptions.name;
    this.description = this.translate.get(descriptionLabel).pipe(
      filter((msg) => msg !== descriptionLabel),
      startWith('')
    );

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    this.searching = this.authorityTreeviewService.isSearching();

    this.isAuthenticated.pipe(
      find((isAuth) => isAuth)
    ).subscribe(() => {
      const valueId: string = (this.selectedItem) ? (this.selectedItem.authority || this.selectedItem.id) : null;
      this.authorityTreeviewService.initialize(this.searchOptions, valueId);
    });
  }

  search() {
    if (isNotEmpty(this.searchText)) {
      if (isEmpty(this.storedNodeMap)) {
        this.storedNodeMap = this.nodeMap;
      }
      this.nodeMap = new Map<string, TreeviewFlatNode>();
      this.searchOptions.query = this.searchText;
      this.authorityTreeviewService.searchBy(this.searchOptions);
    }
  }

  isSearchEnabled() {
    return isNotEmpty(this.searchText);
  }

  reset() {
    if (isNotEmpty(this.storedNodeMap)) {
      this.nodeMap = this.storedNodeMap;
      this.storedNodeMap = new Map<string, TreeviewFlatNode>();
      this.authorityTreeviewService.restoreNodes();
    }

    this.searchText = '';
    this.searchOptions.query = '';
  }

  ngOnDestroy(): void {
    this.authorityTreeviewService.cleanTree();
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
