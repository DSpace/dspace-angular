import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { QualityAssuranceBreadcrumbService } from './quality-assurance-breadcrumb.service';

describe('QualityAssuranceBreadcrumbService', () => {
  let service: QualityAssuranceBreadcrumbService;
  let translateService: any = {
    instant: (str) => str,
  };

  let exampleString;
  let exampleURL;
  let exampleQaKey;

  function init() {
    exampleString = 'sourceId';
    exampleURL = '/test/quality-assurance/';
    exampleQaKey = 'admin.quality-assurance.breadcrumbs';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({}).compileComponents();
  }));

  beforeEach(() => {
    service = new QualityAssuranceBreadcrumbService(translateService);
  });

  describe('getBreadcrumbs', () => {
    it('should return a breadcrumb based on a string', () => {
      const breadcrumbs = service.getBreadcrumbs(exampleString, exampleURL);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: [new Breadcrumb(exampleQaKey, exampleURL),
        new Breadcrumb(exampleString, exampleURL + exampleString)],
      });
    });
  });
});
