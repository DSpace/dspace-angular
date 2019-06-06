import { SearchConfigurationService } from './search-configuration.service';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { SearchFilter } from '../search-filter.model';
import { of as observableOf } from 'rxjs';

describe('SearchConfigurationService', () => {
  let service: SearchConfigurationService;
  const value1 = 'random value';
  const prefixFilter = {
    'f.author': ['another value'],
    'f.date.min': ['2013'],
    'f.date.max': ['2018']
  };
  const defaults = new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), { currentPage: 1, pageSize: 20 }),
    sort: new SortOptions('score', SortDirection.DESC),
    configuration: 'default',
    query: '',
    scope: ''
  });

  const backendFilters = [new SearchFilter('f.author', ['another value']), new SearchFilter('f.date', ['[2013 TO 2018]'])];

  const routeService = jasmine.createSpyObj('RouteService', {
    getQueryParameterValue: observableOf(value1),
    getQueryParamsWithPrefix: observableOf(prefixFilter),
    getRouteParameterValue: observableOf('')
  });

  const fixedFilterService = jasmine.createSpyObj('SearchFixedFilterService', {
    getQueryByFilterName: observableOf(''),
  });

  const activatedRoute: any = new ActivatedRouteStub();

  beforeEach(() => {
    service = new SearchConfigurationService(routeService, fixedFilterService, activatedRoute);
  });
  describe('when the scope is called', () => {
    beforeEach(() => {
      service.getCurrentScope('');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'scope\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('scope');
    });
  });

  describe('when getCurrentConfiguration is called', () => {
    beforeEach(() => {
      service.getCurrentConfiguration('');
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'configuration\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('configuration');
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

  describe('when getCurrentDSOType is called', () => {
    beforeEach(() => {
      service.getCurrentDSOType();
    });
    it('should call getQueryParameterValue on the routeService with parameter name \'dsoType\'', () => {
      expect((service as any).routeService.getQueryParameterValue).toHaveBeenCalledWith('dsoType');
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
      spyOn(service, 'getCurrentConfiguration').and.callThrough();
      spyOn(service, 'getCurrentQuery').and.callThrough();
      spyOn(service, 'getCurrentDSOType').and.callThrough();
      spyOn(service, 'getCurrentFilters').and.callThrough();
    });

    describe('when subscribeToSearchOptions is called', () => {
      beforeEach(() => {
        (service as any).subscribeToSearchOptions(defaults)
      });
      it('should call all getters it needs, but not call any others', () => {
        expect(service.getCurrentPagination).not.toHaveBeenCalled();
        expect(service.getCurrentSort).not.toHaveBeenCalled();
        expect(service.getCurrentScope).toHaveBeenCalled();
        expect(service.getCurrentConfiguration).toHaveBeenCalled();
        expect(service.getCurrentQuery).toHaveBeenCalled();
        expect(service.getCurrentDSOType).toHaveBeenCalled();
        expect(service.getCurrentFilters).toHaveBeenCalled();
      });
    });

    describe('when subscribeToPaginatedSearchOptions is called', () => {
      beforeEach(() => {
        (service as any).subscribeToPaginatedSearchOptions(defaults);
      });
      it('should call all getters it needs', () => {
        expect(service.getCurrentPagination).toHaveBeenCalled();
        expect(service.getCurrentSort).toHaveBeenCalled();
        expect(service.getCurrentScope).toHaveBeenCalled();
        expect(service.getCurrentConfiguration).toHaveBeenCalled();
        expect(service.getCurrentQuery).toHaveBeenCalled();
        expect(service.getCurrentDSOType).toHaveBeenCalled();
        expect(service.getCurrentFilters).toHaveBeenCalled();
      });
    });
  });

  describe('when getCurrentFixedFilter is called', () => {
    beforeEach(() => {
      service.getCurrentFixedFilter();
    });
    it('should call getRouteParameterValue on the routeService with parameter name \'filter\'', () => {
      expect((service as any).routeService.getRouteParameterValue).toHaveBeenCalledWith('filter');
    });
  });
});
