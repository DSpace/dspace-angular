import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';

import { of as observableOf } from 'rxjs';

import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;
  const paramName1 = 'name';
  const paramValue1 = 'Test Name';
  const paramName2 = 'id';
  const paramValue2a = 'Test id';
  const paramValue2b = 'another id';
  const nonExistingParamName = 'non existing name';
  const nonExistingParamValue = 'non existing value';

  const paramObject: Params = {};

  paramObject[paramName1] = paramValue1;
  paramObject[paramName2] = [paramValue2a, paramValue2b];

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: observableOf(paramObject),
            queryParamMap: observableOf(convertToParamMap(paramObject))
          },
        },
      ]
    });
  }));

  beforeEach(() => {
    service = new RouteService(TestBed.get(ActivatedRoute));
  });

  describe('hasQueryParam', () => {
    it('should return true when the parameter name exists', () => {
      service.hasQueryParam(paramName1).subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
    it('should return false when the parameter name does not exists', () => {
      service.hasQueryParam(nonExistingParamName).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('hasQueryParamWithValue', () => {
    it('should return true when the parameter name exists and contains the specified value', () => {
      service.hasQueryParamWithValue(paramName2, paramValue2a).subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
    it('should return false when the parameter name exists and does not contain the specified value', () => {
      service.hasQueryParamWithValue(paramName1, nonExistingParamValue).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
    it('should return false when the parameter name does not exists', () => {
      service.hasQueryParamWithValue(nonExistingParamName, nonExistingParamValue).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });

  describe('getQueryParameterValues', () => {
    it('should return a list of values when the parameter exists', () => {
      service.getQueryParameterValues(paramName2).subscribe((params) => {
        expect(params).toEqual([paramValue2a, paramValue2b]);
      });
    });

    it('should return an empty array when the parameter does not exists', () => {
      service.getQueryParameterValues(nonExistingParamName).subscribe((params) => {
        expect(params).toEqual([]);
      });
    });
  });

  describe('getQueryParameterValue', () => {
    it('should return a single value when the parameter exists', () => {
      service.getQueryParameterValue(paramName1).subscribe((params) => {
        expect(params).toEqual(paramValue1);
      });
    });

    it('should return only the first value when the parameter exists', () => {
      service.getQueryParameterValue(paramName2).subscribe((params) => {
        expect(params).toEqual(paramValue2a);
      });
    });

    it('should return undefined when the parameter exists', () => {
      service.getQueryParameterValue(nonExistingParamName).subscribe((params) => {
        expect(params).toBeNull();
      });
    });
  });

});
