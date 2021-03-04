import { PaginationService } from './pagination.service';
import { RouterStub } from '../../shared/testing/router.stub';
import { of as observableOf } from 'rxjs';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { FindListOptions } from '../data/request.models';


describe('PaginationService', () => {
  let service: PaginationService;
  let router;
  let routeService;

  const defaultPagination = new PaginationComponentOptions();
  const defaultSort = new SortOptions('id', SortDirection.DESC);
  const defaultFindListOptions = new FindListOptions();

  beforeEach(() => {
    router = new RouterStub();
    routeService = {
      getQueryParameterValue: (param) => {
        let value;
        if (param.startsWith('p.')) {
          value = 5;
        }
        if (param.startsWith('rpp.')) {
          value = 10;
        }
        if (param.startsWith('sd.')) {
          value = 'ASC';
        }
        if (param.startsWith('sf.')) {
          value = 'score';
        }
        return observableOf(value);
      }
    };

    service = new PaginationService(routeService, router);
  });


  describe('getCurrentPagination', () => {
    it('should retrieve the current pagination info from the routerService', () => {
      service.getCurrentPagination('test-id', defaultPagination).subscribe((currentPagination) => {
        expect(currentPagination).toEqual(Object.assign(new PaginationComponentOptions(), {
          currentPage: 5,
          pageSize: 10
        }));
      });
    });
  });
  describe('getCurrentSort', () => {
    it('should retrieve the current sort info from the routerService', () => {
      service.getCurrentSort('test-id', defaultSort).subscribe((currentSort) => {
        expect(currentSort).toEqual(Object.assign(new SortOptions('score', SortDirection.ASC )));
      });
    });
  });
  describe('getFindListOptions', () => {
    it('should retrieve the current findListOptions info from the routerService', () => {
      service.getFindListOptions('test-id', defaultFindListOptions).subscribe((findListOptions) => {
        expect(findListOptions).toEqual(Object.assign(new FindListOptions(),
          {
            sort: new SortOptions('score', SortDirection.ASC ),
            currentPage: 5,
            elementsPerPage: 10
          }));
      });
    });
  });
  describe('resetPage', () => {
    it('should call the updateRoute method with the id and page 1', () => {
      spyOn(service, 'updateRoute');
      service.resetPage('test');

      expect(service.updateRoute).toHaveBeenCalledWith('test', {page: 1});
    });
  });

  describe('updateRoute', () => {
    it('should update the route with the provided page params', () => {
      service.updateRoute('test', {page: 2, pageSize: 5, sortField: 'title', sortDirection: SortDirection.DESC});

      const navigateParams = {};
      navigateParams[`p.test`] = `2`;
      navigateParams[`rpp.test`] = `5`;
      navigateParams[`sf.test`] = `title`;
      navigateParams[`sd.test`] = `DESC`;

      expect(router.navigate).toHaveBeenCalledWith([], {queryParams: navigateParams, queryParamsHandling: 'merge'});
    });
    it('should update the route with the provided page params while keeping the existing non provided ones', () => {
      service.updateRoute('test', {page: 2});

      const navigateParams = {};
      navigateParams[`p.test`] = `2`;
      navigateParams[`rpp.test`] = `10`;
      navigateParams[`sf.test`] = `score`;
      navigateParams[`sd.test`] = `ASC`;

      expect(router.navigate).toHaveBeenCalledWith([], {queryParams: navigateParams, queryParamsHandling: 'merge'});
    });
  });
  describe('updateRouteWithUrl', () => {
    it('should update the route with the provided page params and url', () => {
      service.updateRouteWithUrl('test', ['someUrl'], {page: 2, pageSize: 5, sortField: 'title', sortDirection: SortDirection.DESC});

      const navigateParams = {};
      navigateParams[`p.test`] = `2`;
      navigateParams[`rpp.test`] = `5`;
      navigateParams[`sf.test`] = `title`;
      navigateParams[`sd.test`] = `DESC`;

      expect(router.navigate).toHaveBeenCalledWith(['someUrl'], {queryParams: navigateParams, queryParamsHandling: 'merge'});
    });
    it('should update the route with the provided page params and url while keeping the existing non provided ones', () => {
      service.updateRouteWithUrl('test',['someUrl'], {page: 2});

      const navigateParams = {};
      navigateParams[`p.test`] = `2`;
      navigateParams[`rpp.test`] = `10`;
      navigateParams[`sf.test`] = `score`;
      navigateParams[`sd.test`] = `ASC`;

      expect(router.navigate).toHaveBeenCalledWith(['someUrl'], {queryParams: navigateParams, queryParamsHandling: 'merge'});
    });

  });
  describe('clearPagination', () => {
    it('should clear the pagination info from the route for the current id', () => {
      service.clearPagination('test');

      const params = {};
      params[`p.test`] = null;
      params[`rpp.test`] = null;
      params[`sf.test`] = null;
      params[`sd.test`] = null;

      expect(router.navigate).toHaveBeenCalledWith([], {queryParams: params, queryParamsHandling: 'merge'});
    });
  });
  describe('getPageParam', () => {
    it('should return the name of the page param', () => {
      const pageParam = service.getPageParam('test');
      expect(pageParam).toEqual('p.test');
    });
  });
});
