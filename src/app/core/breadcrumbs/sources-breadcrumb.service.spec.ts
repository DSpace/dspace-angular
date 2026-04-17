import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { SourcesBreadcrumbService } from './sources-breadcrumb.service';

describe('SourcesBreadcrumbService', () => {
  let service: SourcesBreadcrumbService;
  let translateService: any = {
    instant: (str) => str,
  };

  let exampleString;
  let exampleSource;
  let exampleTopic;
  let exampleArg;
  let exampleArgTopic;
  let exampleURL;
  let exampleQaKey;

  function init() {
    exampleString = 'admin.quality-assurance';
    exampleSource = 'sourceId';
    exampleTopic = 'topic';
    exampleArg = `${exampleString}:${exampleSource}`;
    exampleArgTopic = `${exampleString}:${exampleSource}:${exampleTopic}`;
    exampleURL = '/test/quality-assurance/';
    exampleQaKey = 'admin.quality-assurance.breadcrumbs';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({}).compileComponents();
  }));

  beforeEach(() => {
    service = new SourcesBreadcrumbService(translateService);
  });

  describe('getBreadcrumbs', () => {

    it('should return a breadcrumb based on source only', () => {
      const breadcrumbs = service.getBreadcrumbs(exampleArg, exampleURL);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: [new Breadcrumb(exampleQaKey, exampleURL),
        new Breadcrumb(exampleSource, exampleURL + exampleSource)],
      });
    });

    it('should return a breadcrumb based also on topic', () => {
      const breadcrumbs = service.getBreadcrumbs(exampleArgTopic, exampleURL);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: [new Breadcrumb(exampleQaKey, exampleURL),
        new Breadcrumb(exampleSource, exampleURL + exampleSource),
        new Breadcrumb(exampleTopic, undefined)],
      });
    });
  });
});
