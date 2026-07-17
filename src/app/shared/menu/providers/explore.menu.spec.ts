/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';

import { environment } from '../../../../environments/environment';
import { ExploreMenuProvider } from './explore.menu';

describe('ExploreMenuProvider', () => {

  let provider: ExploreMenuProvider;
  let sectionDataServiceStub = {
    findVisibleSections: () => createSuccessfulRemoteDataObject$(createPaginatedList([])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExploreMenuProvider,
        { provide: APP_CONFIG, useValue: environment },
        { provide: SectionDataService, useValue: sectionDataServiceStub },
      ],
    });
    provider = TestBed.inject(ExploreMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });
});
