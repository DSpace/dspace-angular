import { RouteService } from './route.service';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
            queryParams: Observable.of(paramObject),
            queryParamMap: Observable.of(convertToParamMap(paramObject))
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

  describe('addQueryParameterValue', () => {
    it('should return a list of values that contains the added value when a new value is added and the parameter did not exist yet', () => {
      service.resolveRouteWithParameterValue(nonExistingParamName, nonExistingParamValue).subscribe((params) => {
        expect(params[nonExistingParamName]).toContain(nonExistingParamValue);
      });
    });
    it('should return a list of values that contains the existing values and the added value when a new value is added and the parameter already has values', () => {
      service.resolveRouteWithParameterValue(paramName1, nonExistingParamValue).subscribe((params) => {
        const values = params[paramName1];
        expect(values).toContain(paramValue1);
        expect(values).toContain(nonExistingParamValue);
      });
    });
  });

  describe('removeQueryParameterValue', () => {
    it('should return a list of values that does not contain the removed value when the parameter value exists', () => {
      service.resolveRouteWithoutParameterValue(paramName2, paramValue2a).subscribe((params) => {
        const values = params[paramName2];
        expect(values).toContain(paramValue2b);
        expect(values).not.toContain(paramValue2a);
      });
    });

    it('should return a list of values that does contain all existing values when the removed parameter does not exist', () => {
      service.resolveRouteWithoutParameterValue(paramName2, nonExistingParamValue).subscribe((params) => {
        const values = params[paramName2];
        expect(values).toContain(paramValue2a);
        expect(values).toContain(paramValue2b);
      });
    });
  });

  describe('getWithoutParameter', () => {
    it('should return a list of values that does not contain any values for the parameter anymore when the parameter exists', () => {
      service.resolveRouteWithoutParameter(paramName2).subscribe((params) => {
        const values = params[paramName2];
        expect(values).toEqual({});
      });
    });
    it('should return a list of values that does not contain any values for the parameter when the parameter does not exist', () => {
      service.resolveRouteWithoutParameter(nonExistingParamName).subscribe((params) => {
        const values = params[nonExistingParamName];
        expect(values).toEqual({});
      });
    });
  });

});
