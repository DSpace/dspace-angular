import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BREADCRUMB_MESSAGE_POSTFIX } from './i18n-breadcrumbs.service';
import { NavigationBreadcrumbsService } from './navigation-breadcrumb.service';

describe('NavigationBreadcrumbsService', () => {
  let service: NavigationBreadcrumbsService;
  let exampleString;
  let exampleURL;
  let childrenString;
  let childrenUrl;
  let parentString;
  let parentUrl;

  function init() {
    exampleString = 'example.string:parent.string';
    exampleURL = 'example.com:parent.com';
    childrenString = 'example.string';
    childrenUrl = 'example.com';
    parentString = 'parent.string';
    parentUrl = 'parent.com';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({}).compileComponents();
  }));

  beforeEach(() => {
    service = new NavigationBreadcrumbsService();
  });

  describe('getBreadcrumbs', () => {
    it('should return an array of breadcrumbs based on strings by adding the postfix', () => {
      const breadcrumbs = service.getBreadcrumbs(exampleString, exampleURL);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: [
        new Breadcrumb(childrenString + BREADCRUMB_MESSAGE_POSTFIX, childrenUrl),
        new Breadcrumb(parentString + BREADCRUMB_MESSAGE_POSTFIX, parentUrl),
      ].reverse() });
    });
  });
});
