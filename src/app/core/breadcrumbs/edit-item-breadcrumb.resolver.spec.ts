import {
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { editItemBreadcrumbResolver } from '@dspace/core/breadcrumbs/edit-item-breadcrumb.resolver';
import { Item } from '@dspace/core/shared/item.model';
import { getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';

import { ItemDataService } from '../data/item-data.service';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

describe('editItemBreadcrumbResolver', () => {
  describe('resolve', () => {
    let resolver: any;
    let dsoBreadcrumbService: any;
    let itemDataService: any;
    let testItem: Item;
    let uuid: string;
    let breadcrumbUrl: string;
    let currentUrl: string;

    beforeEach(() => {
      uuid = '1234-65487-12354-1235';
      breadcrumbUrl = `/items/${uuid}`;
      currentUrl = `${breadcrumbUrl}/edit`;
      testItem = Object.assign(new Item(), {
        uuid: uuid,
        type: 'item',
      });

      itemDataService = {
        findById: () => createSuccessfulRemoteDataObject$(testItem),
      };

      dsoBreadcrumbService = {
        getRepresentativeName: () => testItem.uuid,
        getBreadcrumbs: () => of({ provider: dsoBreadcrumbService, key: testItem, url: breadcrumbUrl }),
      };

      TestBed.configureTestingModule({
        providers: [
          { provide: DSOBreadcrumbsService, useValue: dsoBreadcrumbService },
          { provide: ItemDataService, useValue: itemDataService },
        ],
      });

      resolver = editItemBreadcrumbResolver;
    });

    it('should resolve a breadcrumb config for the correct uuid', () => {
      const injector = TestBed.inject(EnvironmentInjector);
      const resolvedConfig = runInInjectionContext(injector, () =>
        resolver({ params: { id: testItem.uuid + ':FULL' } } as any, { url: currentUrl } as any),
      );
      const expectedConfig = { provider: dsoBreadcrumbService, key: testItem, url: breadcrumbUrl };
      getTestScheduler().expectObservable(resolvedConfig).toBe('(a|)', { a: expectedConfig });
    });
  });
});
