import {
  CdkTreeModule,
  FlatTreeControl,
} from '@angular/cdk/tree';
import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';

import { PageInfo } from '../../../core/shared/page-info.model';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { AlertComponent } from '../../alert/alert.component';
import { AlertType } from '../../alert/alert-type';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '../../empty.util';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { FormFieldMetadataValueObject } from '../builder/models/form-field-metadata-value.model';
import { VocabularyTreeFlatDataSource } from './vocabulary-tree-flat-data-source';
import { VocabularyTreeFlattener } from './vocabulary-tree-flattener';
import { VocabularyTreeviewService } from './vocabulary-treeview.service';
import {
  LOAD_MORE,
  LOAD_MORE_ROOT,
  TreeviewFlatNode,
  TreeviewNode,
} from './vocabulary-treeview-node.model';

export type VocabularyTreeItemType = FormFieldMetadataValueObject | VocabularyEntry | VocabularyEntryDetail;

/**
 * Component that shows a hierarchical vocabulary in a tree view
 */
@Component({
  selector: 'ds-vocabulary-treeview',
  templateUrl: './vocabulary-treeview.component.html',
  styleUrls: ['./vocabulary-treeview.component.scss'],
  imports: [
    FormsModule,
    NgbTooltipModule,
    NgIf,
    CdkTreeModule,
    TranslateModule,
    AsyncPipe,
    ThemedLoadingComponent,
    AlertComponent,
  ],
  standalone: true,
})
export class VocabularyTreeviewComponent implements OnDestroy, OnInit, OnChanges {

  /**
   * The {@link VocabularyOptions} object
   */
  @Input() vocabularyOptions: VocabularyOptions;

  /**
   * Representing how many tree level load at initialization
   */
  @Input() preloadLevel = 2;

  /**
   * Contain a descriptive message for the tree
   */
  @Input() description = '';

  /**
   * Whether to allow selecting multiple values with checkboxes
   */
  @Input() multiSelect = false;

  /**
   * A boolean representing if to show the add button or not
   */
  @Input() showAdd = true;

  /**
   * The vocabulary entries already selected, if any
   */
  @Input() selectedItems: VocabularyTreeItemType[] = [];

  /**
   * A map containing the current node showed by the tree
   */
  nodeMap = new Map<string, TreeviewFlatNode>();

  /**
   * A map containing all the node already created for building the tree
   */
  storedNodeMap = new Map<string, TreeviewFlatNode>();

  /**
   * Flat tree control object. Able to expand/collapse a subtree recursively for flattened tree.
   */
  treeControl: FlatTreeControl<TreeviewFlatNode>;

  /**
   * Tree flattener object. Able to convert a normal type of node to node with children and level information.
   */
  treeFlattener: VocabularyTreeFlattener<TreeviewNode, TreeviewFlatNode>;

  /**
   * Flat tree data source
   */
  dataSource: VocabularyTreeFlatDataSource<TreeviewNode, TreeviewFlatNode>;

  /**
   * The content of the search box used to search for a vocabulary entry
   */
  searchText: string;

  /**
   * A boolean representing if tree is loading
   */
  loading: Observable<boolean>;

  /**
   * An event fired when a vocabulary entry is selected.
   * Event's payload equals to {@link VocabularyTreeItemType} selected.
   */
  @Output() select: EventEmitter<VocabularyTreeItemType> = new EventEmitter<VocabularyTreeItemType>(null);

  /**
   * An event fired when a vocabulary entry is deselected.
   * Event's payload equals to {@link VocabularyTreeItemType} deselected.
   */
  @Output() deselect: EventEmitter<VocabularyTreeItemType> = new EventEmitter<VocabularyTreeItemType>(null);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  readonly AlertType = AlertType;

  /**
   * Initialize instance variables
   *
   * @param {VocabularyTreeviewService} vocabularyTreeviewService
   */
  constructor(
    private vocabularyTreeviewService: VocabularyTreeviewService,
  ) {
    this.treeFlattener = new VocabularyTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<TreeviewFlatNode>(this.getLevel, this.isExpandable);

    this.dataSource = new VocabularyTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  /**
   * Get children for a given node
   * @param node The node for which to retrieve the children
   */
  getChildren = (node: TreeviewNode): Observable<TreeviewNode[]> => node.childrenChange;

  /**
   * Transform a {@link TreeviewNode} to {@link TreeviewFlatNode}
   * @param node The node to transform
   * @param level The node level information
   */
  transformer = (node: TreeviewNode, level: number) => {
    const entryId = this.getEntryId(node.item);
    const existingNode = this.nodeMap.get(entryId);

    if (existingNode && existingNode.item.id !== LOAD_MORE && existingNode.item.id !== LOAD_MORE_ROOT) {
      return existingNode;
    }

    const newNode: TreeviewFlatNode = new TreeviewFlatNode(
      node.item,
      level,
      node.hasChildren,
      (node.hasChildren && isNotEmpty(node.children)),
      node.pageInfo,
      node.loadMoreParentItem,
      node.isSearchNode,
      node.isInInitValueHierarchy,
      node.isSelected,
    );
    this.nodeMap.set(entryId, newNode);

    if ((((level + 1) < this.preloadLevel) && newNode.childrenLoaded)
      || (newNode.isSearchNode && newNode.childrenLoaded)
      || newNode.isInInitValueHierarchy) {
      if (!newNode.isSearchNode) {
        this.loadChildren(newNode);
      }
      this.treeControl.expand(newNode);
    }
    return newNode;
  };

  /**
   * Get tree level for a given node
   * @param node The node for which to retrieve the level
   */
  getLevel = (node: TreeviewFlatNode) => node.level;

  /**
   * Check if a given node is expandable
   * @param node The node for which to retrieve the information
   */
  isExpandable = (node: TreeviewFlatNode) => node.expandable;

  /**
   * Check if a given node has children
   * @param _nodeData The node for which to retrieve the information
   */
  hasChildren = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.expandable;

  /**
   * Check if a given node has more children to load
   * @param _nodeData The node for which to retrieve the information
   */
  isLoadMore = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.item.id === LOAD_MORE;

  /**
   * Check if there are more node to load at root level
   * @param _nodeData The node for which to retrieve the information
   */
  isLoadMoreRoot = (_: number, _nodeData: TreeviewFlatNode) => _nodeData.item.id === LOAD_MORE_ROOT;

  /**
   * Initialize the component, setting up the data to build the tree
   */
  ngOnInit(): void {
    this.subs.push(
      this.vocabularyTreeviewService.getData().subscribe((data) => {
        this.dataSource.data = data;
      }),
    );

    this.loading = this.vocabularyTreeviewService.isLoading();

    const entryId: string = (this.selectedItems?.length > 0) ? this.getEntryId(this.selectedItems[0]) : null;
    this.vocabularyTreeviewService.initialize(this.vocabularyOptions, new PageInfo(), this.getSelectedEntryIds(), entryId);
  }

  /**
   * Expand a node whose children are not loaded
   * @param item The VocabularyEntryDetail for which to load more nodes
   */
  loadMore(item: VocabularyEntryDetail) {
    this.vocabularyTreeviewService.loadMore(item, this.getSelectedEntryIds());
  }

  /**
   * Expand the root node whose children are not loaded
   * @param node The TreeviewFlatNode for which to load more nodes
   */
  loadMoreRoot(node: TreeviewFlatNode) {
    this.vocabularyTreeviewService.loadMoreRoot(node, this.getSelectedEntryIds());
  }

  /**
   * Load children nodes for a node
   * @param node The TreeviewFlatNode for which to load children nodes
   */
  loadChildren(node: TreeviewFlatNode) {
    this.vocabularyTreeviewService.loadMore(node.item, this.getSelectedEntryIds(), true);
  }

  /**
   * Method called on entry select/deselect
   */
  onSelect(item: VocabularyEntryDetail) {
    if (!this.getSelectedEntryIds().includes(this.getEntryId(item))) {
      this.selectedItems.push(item);
      this.select.emit(item);
    } else {
      this.selectedItems = this.selectedItems.filter((detail: VocabularyTreeItemType) => this.getEntryId(detail) !== this.getEntryId(item));
      this.deselect.emit(item);
    }
  }

  /**
   * Search for a vocabulary entry by query
   */
  search() {
    if (isNotEmpty(this.searchText)) {
      if (isEmpty(this.storedNodeMap)) {
        this.storedNodeMap = this.nodeMap;
      }
      this.nodeMap = new Map<string, TreeviewFlatNode>();
      this.vocabularyTreeviewService.searchByQuery(this.searchText, this.getSelectedEntryIds());
    }
  }

  /**
   * Check if search box contains any text
   */
  isSearchEnabled() {
    return isNotEmpty(this.searchText);
  }

  /**
   * Reset tree resulting from a previous search
   */
  reset() {
    this.searchText = '';
    for (const item of this.selectedItems) {
      this.deselect.emit(item);
      this.nodeMap.get(this.getEntryId(item)).isSelected = false;
    }
    this.selectedItems = [];

    if (isNotEmpty(this.storedNodeMap)) {
      this.nodeMap = this.storedNodeMap;
      this.storedNodeMap = new Map<string, TreeviewFlatNode>();
      this.vocabularyTreeviewService.restoreNodes();
    }
  }

  add() {
    const userVocabularyEntry = {
      value: this.searchText,
      display: this.searchText,
    } as VocabularyEntryDetail;
    this.select.emit(userVocabularyEntry);
  }


  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.vocabularyTreeviewService.cleanTree();
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Return an id for a given {@link VocabularyTreeItemType}
   */
  private getEntryId(entry: VocabularyTreeItemType): string {
    return entry?.authority || entry?.otherInformation?.id || (entry as any)?.id || undefined;
  }

  /**
   * Return an ids for all selected entries
   */
  private getSelectedEntryIds(): string[] {
    return this.selectedItems
      .map((entry: VocabularyTreeItemType) => this.getEntryId(entry))
      .filter((value) => isNotEmpty(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.vocabularyOptions.isFirstChange() && changes.vocabularyOptions.currentValue !== changes.vocabularyOptions.previousValue) {
      this.selectedItems = [];
      this.searchText = '';
      this.vocabularyTreeviewService.cleanTree();
      this.vocabularyTreeviewService.initialize(this.vocabularyOptions, new PageInfo(), this.getSelectedEntryIds(), null);
    }
  }
}
