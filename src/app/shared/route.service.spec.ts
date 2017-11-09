import { RouteService } from './route.service';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
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
      declarations: [RouteService],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of([paramObject]),
          },
        },
      ]
    });
  }));

  beforeEach(() => {
    service = new RouteService(TestBed.get(ActivatedRoute));
  });

  describe('hasQueryParam', () => {
    it(' should return true when the parameter name exists', () => {
      service.hasQueryParam(paramName1).subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });
    it(' should return false when the parameter name does not exists', () => {
      service.hasQueryParam(nonExistingParamName).subscribe((status) => {
        expect(status).toBeFalsy();
      });
    });
  });
});
