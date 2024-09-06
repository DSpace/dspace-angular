import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ItemDataService } from '../core/data/item-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { Item } from '../core/shared/item.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import {
  tabDetailsTest,
  tabPublicationsTest,
} from '../shared/testing/layout-tab.mocks';
import { createPaginatedList } from '../shared/testing/utils.test';
import { crisItemPageTabResolver } from './cris-item-page-tab.resolver';

describe('crisItemPageTabResolver', () => {
  let itemService: jasmine.SpyObj<ItemDataService>;
  let tabService: jasmine.SpyObj<TabDataService>;
  let hardRedirectService: jasmine.SpyObj<HardRedirectService>;
  let router: Router;

  const uuid = '1234-65487-12354-1235';
  const item = Object.assign(new Item(), {
    id: uuid,
    uuid: uuid,
    metadata: {
      'dspace.entity.type': [{ value: 'Publication' }],
    },
  });

  const tabsRD = createSuccessfulRemoteDataObject(createPaginatedList([tabPublicationsTest, tabDetailsTest]));
  const tabsRD$ = createSuccessfulRemoteDataObject$(createPaginatedList([tabPublicationsTest, tabDetailsTest]));

  const noTabsRD = createSuccessfulRemoteDataObject(createPaginatedList([]));
  const noTabsRD$ = createSuccessfulRemoteDataObject$(createPaginatedList([]));

  beforeEach(() => {
    itemService = jasmine.createSpyObj('ItemDataService', ['findById']);
    tabService = jasmine.createSpyObj('TabDataService', ['findByItem']);
    hardRedirectService = jasmine.createSpyObj('HardRedirectService', ['redirect']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'entities/:entity-type/:id/:tab', component: {} as any }])],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: TabDataService, useValue: tabService },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    router = TestBed.inject(Router);
  });

  describe('when item exists', () => {
    beforeEach(() => {
      itemService.findById.and.returnValue(createSuccessfulRemoteDataObject$(item));
    });

    describe('and there are tabs', () => {
      beforeEach(() => {
        tabService.findByItem.and.returnValue(tabsRD$);
        spyOn(router, 'navigateByUrl');
      });

      it('should redirect to root route if given tab is the first one', (done) => {
        const obs = TestBed.runInInjectionContext(() => {
          return crisItemPageTabResolver({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/publications' } as any);
        }) as Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

        obs.pipe(take(1)).subscribe((resolved) => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/entities/publication/1234-65487-12354-1235');
          expect(hardRedirectService.redirect).not.toHaveBeenCalled();
          expect(resolved).toEqual(tabsRD);
          done();
        });
      });

      it('should not redirect to root route if tab different than the main one is given', (done) => {
        const obs = TestBed.runInInjectionContext(() => {
          return crisItemPageTabResolver({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/details' } as any);
        }) as Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

        obs.pipe(take(1)).subscribe((resolved) => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          expect(hardRedirectService.redirect).not.toHaveBeenCalled();
          expect(resolved).toEqual(tabsRD);
          done();
        });
      });

      it('should not redirect to root route if no tab is given', (done) => {
        const obs = TestBed.runInInjectionContext(() => {
          return crisItemPageTabResolver({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235' } as any);
        }) as Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

        obs.pipe(take(1)).subscribe((resolved) => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          expect(hardRedirectService.redirect).not.toHaveBeenCalled();
          expect(resolved).toEqual(tabsRD);
          done();
        });
      });

      it('should navigate to 404 if a wrong tab is given', (done) => {
        const obs = TestBed.runInInjectionContext(() => {
          return crisItemPageTabResolver({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/test' } as any);
        }) as Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

        obs.pipe(take(1)).subscribe((resolved) => {
          expect(router.navigateByUrl).toHaveBeenCalled();
          expect(hardRedirectService.redirect).not.toHaveBeenCalled();
          expect(resolved).toEqual(tabsRD);
          done();
        });
      });
    });

    describe('and there are no tabs', () => {
      beforeEach(() => {
        tabService.findByItem.and.returnValue(noTabsRD$);
        spyOn(router, 'navigateByUrl');
      });

      it('should not redirect nor navigate', (done) => {
        const obs = TestBed.runInInjectionContext(() => {
          return crisItemPageTabResolver({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235' } as any);
        }) as Observable<RemoteData<PaginatedList<CrisLayoutTab>>>;

        obs.pipe(take(1)).subscribe((resolved) => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          expect(hardRedirectService.redirect).not.toHaveBeenCalled();
          expect(resolved).toEqual(noTabsRD);
          done();
        });
      });
    });
  });
});
