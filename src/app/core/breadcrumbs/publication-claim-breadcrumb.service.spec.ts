import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { PublicationClaimBreadcrumbService } from './publication-claim-breadcrumb.service';

describe('PublicationClaimBreadcrumbService', () => {
  let service: PublicationClaimBreadcrumbService;
  let dsoNameService: any = {
    getName: (str) => str,
  };
  let translateService: any = {
    instant: (str) => str,
  };

  let dataService: any = {
    findById: (str) => createSuccessfulRemoteDataObject$(str),
  };

  let authorizationService: any = {
    isAuthorized: (str) => of(true),
  };

  let exampleKey;

  const ADMIN_PUBLICATION_CLAIMS_PATH = 'admin/notifications/publication-claim';
  const ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY = 'admin.notifications.publicationclaim.page.title';

  function init() {
    exampleKey = 'suggestion.suggestionFor.breadcrumb';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({}).compileComponents();
  }));

  beforeEach(() => {
    service = new PublicationClaimBreadcrumbService(dataService,dsoNameService,translateService, authorizationService);
  });

  describe('getBreadcrumbs', () => {
    it('should return a breadcrumb based on a string', () => {
      const breadcrumbs = service.getBreadcrumbs(exampleKey);
      getTestScheduler().expectObservable(breadcrumbs).toBe('(a|)', { a: [new Breadcrumb(ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY, ADMIN_PUBLICATION_CLAIMS_PATH),
        new Breadcrumb(exampleKey, undefined)],
      });
    });
  });
});
