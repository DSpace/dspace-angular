import { SearchConfigurationService } from './search-configuration.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { Observable } from 'rxjs/Observable';

describe('SearchConfigurationService', () => {
  let service: SearchConfigurationService;
  const value1 = 'random value';
  const value2 = 'another value';
  const prefixFilter = {
    'f.author': ['another value'],
    'f.date.min': ['2013'],
    'f.date.max': ['2018']
  };
  const defaults = Object.assign(new PaginatedSearchOptions(), {
    pagination: Object.assign(new PaginationComponentOptions(), { currentPage: 1, pageSize: 20 }),
    sort: new SortOptions('score', SortDirection.DESC),
    query: '',
    scope: ''
  });
  const backendFilters = { 'f.author': ['another value'], 'f.date': ['[2013 TO 2018]'] };

  const spy = jasmine.createSpyObj('RouteService', {
    getQueryParameterValue: Observable.of([value1, value2]),
    getQueryParamsWithPrefix: Observable.of(prefixFilter)
  });

  const activatedRoute: any = new ActivatedRouteStub();

  beforeEach(() => {
    service = new SearchConfigurationService(spy, activatedRoute);
  });

  describe('when the scope is called', () => {
    beforeEach(() => {
      service.getCurrentScope('');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'scope\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('scope');
    });
  });

  describe('when getCurrentQuery is called', () => {
    beforeEach(() => {
      service.getCurrentQuery('');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'query\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('query');
    });
  });

  describe('when getCurrentFrontendFilters is called', () => {
    beforeEach(() => {
      service.getCurrentFrontendFilters();
    });
    it('should call getQueryParamsWithPrefix on the routeService with parameter prefix \'f.\'', () => {
      expect((service as any).routeService.getQueryParamsWithPrefix).toHaveBeenCalledWith('f.');
    });
  });

  describe('when getCurrentFilters is called', () => {
    let parsedValues$;
    beforeEach(() => {
      parsedValues$ = service.getCurrentFilters();
    });
    it('should call getQueryParamsWithPrefix on the routeService with parameter prefix \'f.\'', () => {
      expect((service as any).routeService.getQueryParamsWithPrefix).toHaveBeenCalledWith('f.');
      parsedValues$.subscribe((values) => {
        expect(values).toEqual(backendFilters);
      });
    });
  });

  describe('when getCurrentSort is called', () => {
    beforeEach(() => {
      service.getCurrentSort({} as any);
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'sortDirection\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('sortDirection');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'sortField\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('sortField');
    });
  });
  describe('when getCurrentPagination is called', () => {
    beforeEach(() => {
      service.getCurrentPagination({ currentPage: 1, pageSize: 10 } as any);
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'page\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('page');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'pageSize\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('pageSize');
    });
  });
  describe('when subscribeToSearchOptions or subscribeToPaginatedSearchOptions is called', () => {
    beforeEach(() => {
      spyOn(service, 'getCurrentPagination').and.callThrough();
      spyOn(service, 'getCurrentSort').and.callThrough();
      spyOn(service, 'getCurrentScope').and.callThrough();
      spyOn(service, 'getCurrentQuery').and.callThrough();
      spyOn(service, 'getCurrentFilters').and.callThrough();
    });

    describe('when subscribeToSearchOptions is called', () => {
      beforeEach(() => {
        service.subscribeToSearchOptions(defaults)
      });
      it('should call all getters it needs, but not call any others', () => {
        expect(service.getCurrentPagination).not.toHaveBeenCalled();
        expect(service.getCurrentSort).not.toHaveBeenCalled();
        expect(service.getCurrentScope).toHaveBeenCalled();
        expect(service.getCurrentQuery).toHaveBeenCalled();
        expect(service.getCurrentFilters).toHaveBeenCalled();
      });
    });

    describe('when subscribeToPaginatedSearchOptions is called', () => {
      beforeEach(() => {
        service.subscribeToPaginatedSearchOptions(defaults);
      });
      it('should call all getters it needs', () => {
        expect(service.getCurrentPagination).toHaveBeenCalled();
        expect(service.getCurrentSort).toHaveBeenCalled();
        expect(service.getCurrentScope).toHaveBeenCalled();
        expect(service.getCurrentQuery).toHaveBeenCalled();
        expect(service.getCurrentFilters).toHaveBeenCalled();
      });
    });
  });
});
