import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable, of as observableOf } from 'rxjs';
import { AppState } from '../app.reducer';
import { CommunityDataService } from '../core/data/community-data.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Community } from '../core/shared/community.model';
import { Collection } from '../core/shared/collection.model';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list';
import { getCommunityPageRoute } from '../+community-page/community-page-routing.module';
import { getCollectionPageRoute } from '../+collection-page/collection-page-routing.module';
import { CollectionDataService } from '../core/data/collection-data.service';
import { CommunityListSaveAction } from './community-list.actions';
import { CommunityListState } from './community-list.reducer';

/**
 * Each node in the tree is represented by a flatNode which contains info about the node itself and its position and
 *  state in the tree. There are nodes representing communities, collections and show more links.
 */
export interface FlatNode {
  isExpandable$: Observable<boolean>;
  name: string;
  id: string;
  level: number;
  isExpanded?: boolean;
  parent?: FlatNode;
  payload: Community | Collection | ShowMoreFlatNode;
  isShowMoreNode: boolean;
  route?: string;
  currentCommunityPage?: number;
  currentCollectionPage?: number;
}

/**
 * The show more links in the community tree are also represented by a flatNode so we know where in
 *  the tree it should be rendered an who its parent is (needed for the action resulting in clicking this link)
 */
export class ShowMoreFlatNode {
}

// Helper method to combine an flatten an array of observables of flatNode arrays
export const combineAndFlatten = (obsList: Array<Observable<FlatNode[]>>): Observable<FlatNode[]> =>
  observableCombineLatest(...obsList).pipe(
    map((matrix: FlatNode[][]) =>
      matrix.reduce((combinedList, currentList: FlatNode[]) => [...combinedList, ...currentList]))
  );

/**
 * Creates a flatNode from a community or collection
 * @param c               The community or collection this flatNode represents
 * @param isExpandable    Whether or not this node is expandable (true if it has children)
 * @param level           Level indicating how deep in the tree this node should be rendered
 * @param isExpanded      Whether or not this node already is expanded
 * @param parent          Parent of this node (flatNode representing its parent community)
 */
export const toFlatNode = (
  c: Community | Collection,
  isExpandable: Observable<boolean>,
  level: number,
  isExpanded: boolean,
  parent?: FlatNode
): FlatNode => ({
  isExpandable$: isExpandable,
  name: c.name,
  id: c.id,
  level: level,
  isExpanded,
  parent,
  payload: c,
  isShowMoreNode: false,
  route: c instanceof Community ? getCommunityPageRoute(c.id) : getCollectionPageRoute(c.id),
});

/**
 * Creates a show More flatnode where only the level and parent are of importance
 */
export const showMoreFlatNode = (
  id: string,
  level: number,
  parent: FlatNode
): FlatNode => ({
  isExpandable$: observableOf(false),
  name: 'Show More Flatnode',
  id: id,
  level: level,
  isExpanded: false,
  parent: parent,
  payload: new ShowMoreFlatNode(),
  isShowMoreNode: true,
});

// Selectors the get the communityList data out of the store
const communityListStateSelector = (state: AppState) => state.communityList;
const expandedNodesSelector = createSelector(communityListStateSelector, (communityList: CommunityListState) => communityList.expandedNodes);
const loadingNodeSelector = createSelector(communityListStateSelector, (communityList: CommunityListState) => communityList.loadingNode);

/**
 * Service class for the community list, responsible for the creating of the flat list used by communityList dataSource
 *  and connection to the store to retrieve and save the state of the community list
 */
// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class CommunityListService {

  // page-limited list of top-level communities
  payloads$: Array<Observable<PaginatedList<Community>>>;

  topCommunitiesConfig: PaginationComponentOptions;
  topCommunitiesSortConfig: SortOptions;

  maxSubCommunitiesPerPage: number;
  maxCollectionsPerPage: number;

  constructor(private communityDataService: CommunityDataService, private collectionDataService: CollectionDataService,
              private store: Store<any>) {
    this.topCommunitiesConfig = new PaginationComponentOptions();
    this.topCommunitiesConfig.id = 'top-level-pagination';
    this.topCommunitiesConfig.pageSize = 10;
    this.topCommunitiesConfig.currentPage = 1;
    this.topCommunitiesSortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.initTopCommunityList();

    this.maxSubCommunitiesPerPage = 3;
    this.maxCollectionsPerPage = 3;
  }

  saveCommunityListStateToStore(expandedNodes: FlatNode[], loadingNode: FlatNode): void {
    this.store.dispatch(new CommunityListSaveAction(expandedNodes, loadingNode));
  }

  getExpandedNodesFromStore(): Observable<FlatNode[]> {
    return this.store.select(expandedNodesSelector);
  }

  getLoadingNodeFromStore(): Observable<FlatNode> {
    return this.store.select(loadingNodeSelector);
  }

  /**
   * Increases the payload so it contains the next page of top level communities
   */
  getNextPageTopCommunities(): void {
    this.topCommunitiesConfig.currentPage = this.topCommunitiesConfig.currentPage + 1;
    this.payloads$ = [...this.payloads$, this.communityDataService.findTop({
      currentPage: this.topCommunitiesConfig.currentPage,
      elementsPerPage: this.topCommunitiesConfig.pageSize,
      sort: {
        field: this.topCommunitiesSortConfig.field,
        direction: this.topCommunitiesSortConfig.direction
      }
    }).pipe(
      take(1),
      map((results) => results.payload),
    )];
  }

  /**
   * Gets all top communities, limited by page, and transforms this in a list of flatNodes.
   * @param expandedNodes     List of expanded nodes; if a node is not expanded its subCommunities and collections need
   *                            not be added to the list
   */
  loadCommunities(expandedNodes: FlatNode[]): Observable<FlatNode[]> {
    const res = this.payloads$.map((payload) => {
      return payload.pipe(
        take(1),
        switchMap((result: PaginatedList<Community>) => {
          return this.transformListOfCommunities(result, 0, null, expandedNodes);
        }),
        catchError(() => observableOf([])),
      );
    });
    return combineAndFlatten(res);
  };

  /**
   * Puts the initial top level communities in a list to be called upon
   */
  private initTopCommunityList(): void {
    this.payloads$ = [this.communityDataService.findTop({
      currentPage: this.topCommunitiesConfig.currentPage,
      elementsPerPage: this.topCommunitiesConfig.pageSize,
      sort: {
        field: this.topCommunitiesSortConfig.field,
        direction: this.topCommunitiesSortConfig.direction
      }
    }).pipe(
      take(1),
      map((results) => results.payload),
    )];
  }

  /**
   * Transforms a list of communities to a list of FlatNodes according to the instructions detailed in transformCommunity
   * @param listOfPaginatedCommunities    Paginated list of communities to be transformed
   * @param level                         Level the tree is currently at
   * @param parent                        FlatNode of the parent of this list of communities
   * @param expandedNodes                 List of expanded nodes; if a node is not expanded its subcommunities and collections need not be added to the list
   */
  public transformListOfCommunities(listOfPaginatedCommunities: PaginatedList<Community>,
                                    level: number,
                                    parent: FlatNode,
                                    expandedNodes: FlatNode[]): Observable<FlatNode[]> {
    if (isNotEmpty(listOfPaginatedCommunities.page)) {
      let currentPage = this.topCommunitiesConfig.currentPage;
      if (isNotEmpty(parent)) {
        currentPage = expandedNodes.find((node: FlatNode) => node.id === parent.id).currentCommunityPage;
      }
      const isNotAllCommunities = (listOfPaginatedCommunities.totalElements > (listOfPaginatedCommunities.elementsPerPage * currentPage));
      let obsList = listOfPaginatedCommunities.page
        .map((community: Community) => {
          return this.transformCommunity(community, level, parent, expandedNodes)
        });
      if (isNotAllCommunities && listOfPaginatedCommunities.currentPage > currentPage) {
        obsList = [...obsList, observableOf([showMoreFlatNode('community', level, parent)])];
      }

      return combineAndFlatten(obsList);
    } else {
      return observableOf([]);
    }
  }

  /**
   * Transforms a community in a list of FlatNodes containing firstly a flatnode of the community itself,
   *      followed by flatNodes of its possible subcommunities and collection
   * It gets called recursively for each subcommunity to add its subcommunities and collections to the list
   * Number of subcommunities and collections added, is dependant on the current page the parent is at for respectively subcommunities and collections.
   * @param community         Community being transformed
   * @param level             Depth of the community in the list, subcommunities and collections go one level deeper
   * @param parent            Flatnode of the parent community
   * @param expandedNodes     List of nodes which are expanded, if node is not expanded, it need not add its page-limited subcommunities or collections
   */
  public transformCommunity(community: Community, level: number, parent: FlatNode, expandedNodes: FlatNode[]): Observable<FlatNode[]> {
    let isExpanded = false;
    if (isNotEmpty(expandedNodes)) {
      isExpanded = hasValue(expandedNodes.find((node) => (node.id === community.id)));
    }

    const isExpandable$ = this.getIsExpandable(community);

    const communityFlatNode = toFlatNode(community, isExpandable$, level, isExpanded, parent);

    let obsList = [observableOf([communityFlatNode])];

    if (isExpanded) {
      const currentCommunityPage = expandedNodes.find((node: FlatNode) => node.id === community.id).currentCommunityPage;
      let subcoms = [];
      for (let i = 1; i <= currentCommunityPage; i++) {
        const nextSetOfSubcommunitiesPage = this.communityDataService.findByParent(community.uuid, {
          elementsPerPage: this.maxSubCommunitiesPerPage,
          currentPage: i
        })
          .pipe(
            filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
            take(1),
            switchMap((rd: RemoteData<PaginatedList<Community>>) =>
              this.transformListOfCommunities(rd.payload, level + 1, communityFlatNode, expandedNodes))
          );

        subcoms = [...subcoms, nextSetOfSubcommunitiesPage];
      }

      obsList = [...obsList, combineAndFlatten(subcoms)];

      const currentCollectionPage = expandedNodes.find((node: FlatNode) => node.id === community.id).currentCollectionPage;
      let collections = [];
      for (let i = 1; i <= currentCollectionPage; i++) {
        const nextSetOfCollectionsPage = this.collectionDataService.findByParent(community.uuid, {
          elementsPerPage: this.maxCollectionsPerPage,
          currentPage: i
        })
          .pipe(
            filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
            take(1),
            map((rd: RemoteData<PaginatedList<Collection>>) => {
              let nodes = rd.payload.page
                .map((collection: Collection) => toFlatNode(collection, observableOf(false), level + 1, false, communityFlatNode));
              if ((rd.payload.elementsPerPage * currentCollectionPage) < rd.payload.totalElements && rd.payload.currentPage > currentCollectionPage) {
                nodes = [...nodes, showMoreFlatNode('collection', level + 1, communityFlatNode)];
              }
              return nodes;
            }),
          );
        collections = [...collections, nextSetOfCollectionsPage];
      }
      obsList = [...obsList, combineAndFlatten(collections)];
    }

    return combineAndFlatten(obsList);
  }

  /**
   * Checks if a community has subcommunities or collections by querying the respective services with a pageSize = 0
   *      Returns an observable that combines the result.payload.totalElements fo the observables that the
   *          respective services return when queried
   * @param community     Community being checked whether it is expandable (if it has subcommunities or collections)
   */
  public getIsExpandable(community: Community): Observable<boolean> {
    let hasSubcoms$: Observable<boolean>;
    let hasColls$: Observable<boolean>;
    hasSubcoms$ = this.communityDataService.findByParent(community.uuid, { elementsPerPage: 1 })
      .pipe(
        filter((rd: RemoteData<PaginatedList<Community>>) => rd.hasSucceeded),
        take(1),
        map((results) => results.payload.totalElements > 0),
      );

    hasColls$ = this.collectionDataService.findByParent(community.uuid, { elementsPerPage: 1 })
      .pipe(
        filter((rd: RemoteData<PaginatedList<Collection>>) => rd.hasSucceeded),
        take(1),
        map((results) => results.payload.totalElements > 0),
      );

    let hasChildren$: Observable<boolean>;
    hasChildren$ = observableCombineLatest(hasSubcoms$, hasColls$).pipe(
      take(1),
      map(([hasSubcoms, hasColls]: [boolean, boolean]) => {
        if (hasSubcoms || hasColls) {
          return true;
        } else {
          return false;
        }
      })
    );

    return hasChildren$;
  }

}
