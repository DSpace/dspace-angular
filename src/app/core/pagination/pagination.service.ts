import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../services/route.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { FindListOptions } from '../data/request.models';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { difference } from '../../shared/object.util';
import { isNumeric } from 'rxjs/internal-compatibility';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class PaginationService {

  private defaultSortOptions = new SortOptions('id', SortDirection.ASC);

  constructor(protected routeService: RouteService,
              protected route: ActivatedRoute,
              protected router: Router,
              protected location: Location
  ) {
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  getCurrentPagination(paginationId: string, defaultPagination: PaginationComponentOptions): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue(`p.${paginationId}`);
    const size$ = this.routeService.getQueryParameterValue(`rpp.${paginationId}`);
    return observableCombineLatest([page$, size$]).pipe(map(([page, size]) => {
        return Object.assign(new PaginationComponentOptions(), defaultPagination, {
          currentPage: this.convertToNumeric(page, defaultPagination.currentPage),
          pageSize: this.getBestMatchPageSize(size, defaultPagination)
        });
      })
    );
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings
   */
  getCurrentSort(paginationId: string, defaultSort: SortOptions, ignoreDefault?: boolean): Observable<SortOptions> {
    if (!ignoreDefault && (isEmpty(defaultSort) || !hasValue(defaultSort))) {
      defaultSort = this.defaultSortOptions;
    }
    const sortDirection$ = this.routeService.getQueryParameterValue(`sd.${paginationId}`);
    const sortField$ = this.routeService.getQueryParameterValue(`sf.${paginationId}`);
    return observableCombineLatest([sortDirection$, sortField$]).pipe(map(([sortDirection, sortField]) => {
        const field = sortField || defaultSort?.field;
        const direction = SortDirection[sortDirection] || defaultSort?.direction;
        return new SortOptions(field, direction);
      })
    );
  }

  getFindListOptions(paginationId: string, defaultFindList: FindListOptions, ignoreDefault?: boolean): Observable<FindListOptions> {
    const paginationComponentOptions = new PaginationComponentOptions();
    paginationComponentOptions.currentPage = defaultFindList.currentPage;
    paginationComponentOptions.pageSize = defaultFindList.elementsPerPage;
    const currentPagination$ = this.getCurrentPagination(paginationId, paginationComponentOptions);
    const currentSortOptions$ = this.getCurrentSort(paginationId, defaultFindList.sort, ignoreDefault);

    return observableCombineLatest([currentPagination$, currentSortOptions$]).pipe(
      filter(([currentPagination, currentSortOptions]) => hasValue(currentPagination) && hasValue(currentSortOptions)),
      map(([currentPagination, currentSortOptions]) => {
        return Object.assign(new FindListOptions(), defaultFindList, {
          sort: currentSortOptions,
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize
        });
      }));
  }

  resetPage(paginationId: string) {
    this.updateRoute(paginationId, {page: 1});
  }

  getCurrentRouting(paginationId: string) {
    return this.getFindListOptions(paginationId, {}, true).pipe(
      take(1),
      map((findListoptions: FindListOptions) => {
        return {
          page: findListoptions.currentPage,
          pageSize: findListoptions.elementsPerPage,
          sortField: findListoptions.sort.field,
          sortDir: findListoptions.sort.direction,
        };
      })
    );
  }

  updateRoute(paginationId: string, params: {
    page?: number
    pageSize?: number
    sortField?: string
    sortDirection?: SortDirection
  }, extraParams?, retainScrollPosition?: boolean) {
    this.getCurrentRouting(paginationId).subscribe((currentFindListOptions) => {
      const currentParametersWithIdName = this.getParametersWithIdName(paginationId, currentFindListOptions);
      const parametersWithIdName = this.getParametersWithIdName(paginationId, params);
      if (isNotEmpty(difference(parametersWithIdName, currentParametersWithIdName)) || isNotEmpty(extraParams)) {
        const queryParams = Object.assign({}, currentParametersWithIdName,
          parametersWithIdName, extraParams);
        console.log(retainScrollPosition);
        if (retainScrollPosition) {
          this.router.navigate([], {
            queryParams: queryParams,
            queryParamsHandling: 'merge',
            fragment: `p-${paginationId}`
          });
        } else {
          this.router.navigate([], {
            queryParams: queryParams,
            queryParamsHandling: 'merge'
          });
        }
      }
    });
  }

  updateRouteWithUrl(paginationId: string, url: string[], params: {
    page?: number
    pageSize?: number
    sortField?: string
    sortDirection?: SortDirection
  }, extraParams?, retainScrollPosition?: boolean) {
    console.log(retainScrollPosition);
    this.getCurrentRouting(paginationId).subscribe((currentFindListOptions) => {
      const currentParametersWithIdName = this.getParametersWithIdName(paginationId, currentFindListOptions);
      const parametersWithIdName = this.getParametersWithIdName(paginationId, params);
      if (isNotEmpty(difference(parametersWithIdName, currentParametersWithIdName)) || isNotEmpty(extraParams)) {
        const queryParams = Object.assign({}, currentParametersWithIdName,
          parametersWithIdName, extraParams);
        if (retainScrollPosition) {
          this.router.navigate(url, {
            queryParams: queryParams,
            queryParamsHandling: 'merge',
            fragment: `p-${paginationId}`
          });
        } else {
          this.router.navigate(url, {
            queryParams: queryParams,
            queryParamsHandling: 'merge'
          });
        }
      }
    });
  }

  clearPagination(paginationId: string) {
    const params = {};
    params[`p.${paginationId}`] = null;
    params[`rpp.${paginationId}`] = null;
    params[`sf.${paginationId}`] = null;
    params[`sd.${paginationId}`] = null;

    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  getPageParam(paginationId: string) {
    return `p.${paginationId}`;
  }

  getParametersWithIdName(paginationId: string, params: {
    page?: number
    pageSize?: number
    sortField?: string
    sortDirection?: SortDirection
  }) {
    const paramsWithIdName = {};
    if (hasValue(params.page)) {
      paramsWithIdName[`p.${paginationId}`] = `${params.page}`;
    }
    if (hasValue(params.pageSize)) {
      paramsWithIdName[`rpp.${paginationId}`] = `${params.pageSize}`;
    }
    if (hasValue(params.sortField)) {
      paramsWithIdName[`sf.${paginationId}`] = `${params.sortField}`;
    }
    if (hasValue(params.sortDirection)) {
      paramsWithIdName[`sd.${paginationId}`] = `${params.sortDirection}`;
    }
    return paramsWithIdName;
  }

  private convertToNumeric(param, defaultValue) {
    let result = defaultValue;
    if (isNumeric(param)) {
      result = +param;
    }
    return result;
  }


  private getBestMatchPageSize(pageSize: any, defaultPagination: PaginationComponentOptions): number {
    const numberPageSize = this.convertToNumeric(pageSize, defaultPagination.pageSize);
    const differenceList = defaultPagination.pageSizeOptions.map((pageSizeOption) => {
      return Math.abs(pageSizeOption - numberPageSize);
    });
    const minDifference = Math.min.apply(Math, differenceList);
    return defaultPagination.pageSizeOptions[differenceList.indexOf(minDifference)];
  }

}
