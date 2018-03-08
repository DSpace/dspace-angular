import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../core/shared/page-info.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';

import { hasValue, isEmpty, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { SearchService, shuffle } from '../../+search-page/search-service/search.service';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { FilterType } from '../../+search-page/search-service/filter-type.model';
import { SearchOptions } from '../../+search-page/search-options.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { MyDSpaceResult } from '../my-dspace-result.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { WorkspaceitemMyDSpaceResult } from '../../shared/object-collection/shared/workspaceitem-my-dspace-result.model';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { Metadatum } from '../../core/shared/metadatum.model';
import { Item } from '../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../shared/object-collection/shared/item-my-dspace-result.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { getAuthenticatedUser } from '../../core/auth/selectors';
import { WorkflowitemDataService } from '../../core/submission/workflowitem-data.service';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { PoolTask } from '../../core/tasks/models/pool-task-object.model';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { WorkflowitemMyDSpaceResult } from '../../shared/object-collection/shared/workflowitem-my-dspace-result.model';
import { ClaimedTaskMyDSpaceResult } from '../../shared/object-collection/shared/claimed-task-my-dspace-result.model';
import { PoolTaskMyDSpaceResult } from '../../shared/object-collection/shared/pool-task-my-dspace-result.model';

@Injectable()
export class MyDspaceService extends SearchService implements OnDestroy {

  config: SearchFilterConfig[] = [
    Object.assign(new SearchFilterConfig(),
      {
        name: 'status',
        type: FilterType.hierarchy,
        hasFacets: true,
        isOpenByDefault: true
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date_submitted',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'date_issued',
        type: FilterType.range,
        hasFacets: true,
        isOpenByDefault: false
      }),
    Object.assign(new SearchFilterConfig(),
      {
        name: 'type',
        type: FilterType.text,
        hasFacets: false,
        isOpenByDefault: false
      })
  ];
  // searchOptions: BehaviorSubject<SearchOptions>;
  searchOptions: SearchOptions;
  totalElements: number;
  user: Observable<Eperson>;

  constructor(protected claimedTasksDataService: ClaimedTaskDataService,
              protected poolTaskDataService: PoolTaskDataService,
              protected workflowitemDataService: WorkflowitemDataService,
              protected workspaceitemDataService: WorkspaceitemDataService,
              protected itemDataService: ItemDataService,
              protected routeService: RouteService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected store: Store<AppState>,) {

    super(itemDataService, routeService, route, router);
    this.user = this.store.select(getAuthenticatedUser);
  }

  search(query: string, scopeId?: string, searchOptions?: SearchOptions): Observable<RemoteData<Array<MyDSpaceResult<DSpaceObject>>>> {
    this.searchOptions = searchOptions;
    let self = `https://dspace7.4science.it/dspace-spring-rest/api/search?query=${query}`;
    if (hasValue(scopeId)) {
      self += `&scope=${scopeId}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.pagination.currentPage)) {
      self += `&page=${searchOptions.pagination.currentPage}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.pagination.pageSize)) {
      self += `&pageSize=${searchOptions.pagination.pageSize}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.sort.direction)) {
      self += `&sortDirection=${searchOptions.sort.direction}`;
    }
    if (isNotEmpty(searchOptions) && hasValue(searchOptions.sort.field)) {
      self += `&sortField=${searchOptions.sort.field}`;
    }

    const error = undefined;
    const returningPageInfo = new PageInfo();

    if (isNotEmpty(searchOptions)) {
      returningPageInfo.elementsPerPage = searchOptions.pagination.pageSize;
      returningPageInfo.currentPage = searchOptions.pagination.currentPage;
    } else {
      returningPageInfo.elementsPerPage = 10;
      returningPageInfo.currentPage = 1;
    }

    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === 'status');
    return this.routeService.getQueryParameterValues(filterConfig.paramName)
      .first()
      .flatMap((statusArray) => {
        let itemsObs: Observable<RemoteData<PaginatedList<Item>>>;
        let workspaceitemsObs: Observable<RemoteData<PaginatedList<Workspaceitem>>>;
        let workflowitemsObs: Observable<RemoteData<PaginatedList<Workflowitem>>>;
        let claimedTasksObs: Observable<RemoteData<PaginatedList<ClaimedTask>>>;
        let poolTasksObs: Observable<RemoteData<PaginatedList<PoolTask>>>;

        const emptyRD = new RemoteData(
          false,
          false,
          true,
          undefined,
          new PaginatedList(new PageInfo(), []));

        itemsObs = workspaceitemsObs = workflowitemsObs = claimedTasksObs = poolTasksObs = Observable.of(emptyRD);

        // if ((isEmpty(status) || status.length > 1) && (returningPageInfo.currentPage * returningPageInfo.elementsPerPage < 41)) {
        if (isEmpty(statusArray)) {
          itemsObs = this.user
            .filter((user) => isNotEmpty(user))
            .flatMap((user: Eperson) => {
              return this.itemDataService.searchBySubmitter({
                scopeID: user.uuid,
                currentPage: returningPageInfo.currentPage,
                elementsPerPage: returningPageInfo.elementsPerPage
              }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
            });

          workspaceitemsObs = this.user
            .filter((user) => isNotEmpty(user))
            .flatMap((user: Eperson) => {
              return this.workspaceitemDataService.searchBySubmitter({
                scopeID: user.uuid,
                currentPage: returningPageInfo.currentPage,
                elementsPerPage: returningPageInfo.elementsPerPage
              }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
            });

          workflowitemsObs = this.user
            .filter((user) => isNotEmpty(user))
            .flatMap((user: Eperson) => {
              return this.workflowitemDataService.searchBySubmitter({
                scopeID: user.uuid,
                currentPage: returningPageInfo.currentPage,
                elementsPerPage: returningPageInfo.elementsPerPage
              }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
            });

          claimedTasksObs = this.user
            .filter((user) => isNotEmpty(user))
            .flatMap((user: Eperson) => {
              return this.claimedTasksDataService.searchByUser({
                scopeID: user.uuid,
                currentPage: returningPageInfo.currentPage,
                elementsPerPage: returningPageInfo.elementsPerPage
              }).map((rd) => {
                console.log(rd);
                return !rd.hasSucceeded ? emptyRD : rd
              });
            });

          poolTasksObs = this.user
            .filter((user) => isNotEmpty(user))
            .flatMap((user: Eperson) => {
              return this.poolTaskDataService.searchByUser({
                scopeID: user.uuid,
                currentPage: returningPageInfo.currentPage,
                elementsPerPage: returningPageInfo.elementsPerPage
              }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
            });
        } else {
          statusArray.forEach((status) => {
            switch (status) {
              case 'In progress':
                workspaceitemsObs = this.user
                  .filter((user) => isNotEmpty(user))
                  .flatMap((user: Eperson) => {
                    return this.workspaceitemDataService.searchBySubmitter({
                      scopeID: user.uuid,
                      currentPage: returningPageInfo.currentPage,
                      elementsPerPage: returningPageInfo.elementsPerPage
                    }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
                  });
                break;
              case 'Accepted':
                itemsObs = this.user
                  .filter((user) => isNotEmpty(user))
                  .flatMap((user: Eperson) => {
                    return this.itemDataService.searchBySubmitter({
                      scopeID: user.uuid,
                      currentPage: returningPageInfo.currentPage,
                      elementsPerPage: (returningPageInfo.elementsPerPage)
                    }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
                  });
                break;
              case 'Validation':
                claimedTasksObs = this.user
                  .filter((user) => isNotEmpty(user))
                  .flatMap((user: Eperson) => {
                    return this.claimedTasksDataService.searchByUser({
                      scopeID: user.uuid,
                      currentPage: returningPageInfo.currentPage,
                      elementsPerPage: returningPageInfo.elementsPerPage
                    }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
                  });
                break;
              case 'Waiting for controller':
                poolTasksObs = this.user
                  .filter((user) => isNotEmpty(user))
                  .flatMap((user: Eperson) => {
                    return this.poolTaskDataService.searchByUser({
                      scopeID: user.uuid,
                      currentPage: returningPageInfo.currentPage,
                      elementsPerPage: returningPageInfo.elementsPerPage
                    }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
                  });
                break;
              case 'Workflow':
                workflowitemsObs = this.user
                  .filter((user) => isNotEmpty(user))
                  .flatMap((user: Eperson) => {
                    return this.workflowitemDataService.searchBySubmitter({
                      scopeID: user.uuid,
                      currentPage: returningPageInfo.currentPage,
                      elementsPerPage: returningPageInfo.elementsPerPage
                    }).map((rd) => !rd.hasSucceeded ? emptyRD : rd);
                  });
                break;
            }
          })
        }

        return Observable.combineLatest(itemsObs, workspaceitemsObs, workflowitemsObs, claimedTasksObs, poolTasksObs)
          .first()
          .map(([rdi, rdw, rdf, rct, rpt]) => {

            let countElementTypes = 0;
            const totalItems = (isUndefined(rdi.payload.totalElements)) ? 0 : ((rdi.payload.totalElements < 41) ? rdi.payload.totalElements : 40);
            if (totalItems > 0) {
              countElementTypes++;
            }
            const totalWorkspace = (isNotUndefined(rdw.payload.totalElements)) ? rdw.payload.totalElements : 0;
            if (totalWorkspace > 0) {
              countElementTypes++;
            }
            const totalWorkflow = (isNotUndefined(rdf.payload.totalElements)) ? rdf.payload.totalElements : 0;
            if (totalWorkflow > 0) {
              countElementTypes++;
            }
            const totalClaimed = (isNotUndefined(rct.payload.totalElements)) ? rct.payload.totalElements : 0;
            if (totalClaimed > 0) {
              countElementTypes++;
            }
            const totalpool = (isNotUndefined(rpt.payload.totalElements)) ? rpt.payload.totalElements : 0;
            if (totalpool > 0) {
              countElementTypes++;
            }
            const totalElements = totalWorkspace + totalItems + totalWorkflow + totalClaimed + totalpool;

            let limitPerPage = returningPageInfo.elementsPerPage;
            if (totalElements > returningPageInfo.elementsPerPage) {
              limitPerPage = Math.trunc(returningPageInfo.elementsPerPage / countElementTypes);
            }

            const page = [];
            rdi.payload.page
              .forEach((item: Item, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new ItemMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                if (index < limitPerPage) {
                  page.push(mockResult);
                }
              });

            rdw.payload.page
              .forEach((item: Workspaceitem, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new WorkspaceitemMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                if (index < limitPerPage) {
                  page.push(mockResult);
                }
              });

            rdf.payload.page
              .forEach((item: Workflowitem, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new WorkflowitemMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                if (index < limitPerPage) {
                  page.push(mockResult);
                }
              });

            rct.payload.page
              .forEach((item: ClaimedTask, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new ClaimedTaskMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                if (index < limitPerPage) {
                  page.push(mockResult);
                }
              });

            rpt.payload.page
              .forEach((item: PoolTask, index) => {
                const mockResult: MyDSpaceResult<DSpaceObject> = new PoolTaskMyDSpaceResult();
                mockResult.dspaceObject = item;
                const highlight = new Metadatum();
                mockResult.hitHighlights = new Array(highlight);
                if (index < limitPerPage) {
                  page.push(mockResult);
                }
              });

            // const shuffledPage = shuffle(page);
            const payload = Object.assign({}, rdw.payload, { totalElements: totalElements, page: page });

            return new RemoteData(
              rdi.isRequestPending && rdw.isRequestPending && rdf.isRequestPending && rct.isRequestPending && rpt.isRequestPending,
              rdi.isResponsePending && rdw.isResponsePending && rdf.isResponsePending && rct.isResponsePending && rpt.isResponsePending,
              rdi.hasSucceeded && rdw.hasSucceeded && rdf.hasSucceeded && rct.hasSucceeded && rpt.hasSucceeded,
              error,
              payload
            )
          }).startWith(new RemoteData(
            true,
            false,
            undefined,
            undefined,
            undefined
          ))
      });

  }

  getFacetValuesFor(searchFilterConfigName: string): Observable<RemoteData<FacetValue[]>> {
    const filterConfig = this.config.find((config: SearchFilterConfig) => config.name === searchFilterConfigName);
    return this.routeService.getQueryParameterValues(filterConfig.paramName)
      .flatMap((selectedValues: string[]) => {
        const itemsObs = this.user
          .filter((user) => isNotEmpty(user))
          .flatMap((user: Eperson) => {
            return this.itemDataService.searchBySubmitter({
              scopeID: user.uuid,
              currentPage: 1,
              elementsPerPage: 1
            })
          });
        const workspaceitemsObs = this.user
          .filter((user) => isNotEmpty(user))
          .flatMap((user: Eperson) => {
            return this.workspaceitemDataService.searchBySubmitter({
              scopeID: user.uuid,
              currentPage: 1,
              elementsPerPage: 1
            })
          });
        const workflowitemsObs = this.user
          .filter((user) => isNotEmpty(user))
          .flatMap((user: Eperson) => {
            return this.workflowitemDataService.searchBySubmitter({
              scopeID: user.uuid,
              currentPage: 1,
              elementsPerPage: 1
            }).filter((rd) => rd.hasSucceeded);
          });

        const claimedTasksObs = this.user
          .filter((user) => isNotEmpty(user))
          .flatMap((user: Eperson) => {
            return this.claimedTasksDataService.searchByUser({
              scopeID: user.uuid,
              currentPage: 1,
              elementsPerPage: 1
            }).filter((rd) => rd.hasSucceeded);
          });

        const poolTasksObs = this.user
          .filter((user) => isNotEmpty(user))
          .flatMap((user: Eperson) => {
            return this.poolTaskDataService.searchByUser({
              scopeID: user.uuid,
              currentPage: 1,
              elementsPerPage: 1
            }).filter((rd) => rd.hasSucceeded);
          });
        return Observable.combineLatest(itemsObs, workspaceitemsObs, workflowitemsObs, claimedTasksObs, poolTasksObs)
          .first()
          .map(([items, workspaceitem, workflowitem, claimedTasks, poolTasks]) => {
            const payload: FacetValue[] = [];
            if (searchFilterConfigName === 'status') {
              const statusFilters = ['Accepted', 'In progress', 'Validation', 'Waiting for controller', 'Workflow'];
              statusFilters.forEach((value) => {
                if (!selectedValues.includes(value)) {

                  let countFacet;
                  switch (value) {
                    case 'In progress':
                      countFacet = workspaceitem.payload.totalElements;
                      break;
                    case 'Accepted':
                      countFacet = (items.payload.totalElements < 40) ? items.payload.totalElements : 40;
                      break;
                    case 'Validation':
                      countFacet = claimedTasks.payload.totalElements;
                      break;
                    case 'Waiting for controller':
                      countFacet = poolTasks.payload.totalElements;
                      break;
                    case 'Workflow':
                      countFacet = workflowitem.payload.totalElements;
                      break;
                    default:
                      countFacet = 0;
                  }

                  payload.push({
                    value: value,
                    count: countFacet,
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  })
                }
              });
            } else if (searchFilterConfigName === 'type') {
              const statusFilters = ['Article', 'Book', 'Conference material'];
              const totalFilters = 3;
              statusFilters.forEach((value, index) => {
                if (!selectedValues.includes(value)) {
                  payload.push({
                    value: value,
                    count: Math.floor(Math.random() * 20) + 20 * (totalFilters - index), // make sure first results have the highest (random) count,
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  })
                }
              });
            } else {
              const totalFilters = 13;
              for (let i = 0; i < totalFilters; i++) {
                const value = searchFilterConfigName + ' ' + (i + 1);
                if (!selectedValues.includes(value)) {
                  payload.push({
                    value: value,
                    count: Math.floor(Math.random() * 20) + 20 * (totalFilters - i), // make sure first results have the highest (random) count
                    search: decodeURI(this.router.url) + (this.router.url.includes('?') ? '&' : '?') + filterConfig.paramName + '=' + value
                  });
                }
              }
            }
            const requestPending = false;
            const responsePending = false;
            const isSuccessful = true;
            const error = undefined;
            return new RemoteData(
              requestPending,
              responsePending,
              isSuccessful,
              error,
              payload);
          }
        )
      }
    )
  }
}
