import { take } from 'rxjs/operators';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { CrisItemPageTabResolver } from './cris-item-page-tab.resolver';
import { TabDataService } from '../core/layout/tab-data.service';
import { createPaginatedList } from '../shared/testing/utils.test';
import { tabDetailsTest, tabFundingsTest, tabPublicationsTest, } from '../shared/testing/layout-tab.mocks';
import { PLATFORM_ID } from '@angular/core';

describe('CrisItemPageTabResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{
        path: 'entities/:entity-type/:id/:tab',
        component: {} as any
      }])]
    });
  });

  describe('when item exists', () => {
    let resolver: CrisItemPageTabResolver;
    const itemService: jasmine.SpyObj<ItemDataService> = jasmine.createSpyObj('ItemDataService', {
      'findById': jasmine.createSpy('findById')
    });
    const tabService: jasmine.SpyObj<TabDataService> = jasmine.createSpyObj('TabDataService', {
      'findByItem': jasmine.createSpy('findByItem')
    });
    let hardRedirectService: HardRedirectService;

    let router;
    let platformId;

    const uuid = '1234-65487-12354-1235';
    const item = Object.assign(new Item(), {
      id: uuid,
      uuid: uuid,
      metadata: {
        'dspace.entity.type': [
          {
            value: 'Publication'
          }
        ]
      }
    });

  const tabsRD = createSuccessfulRemoteDataObject(createPaginatedList([tabPublicationsTest, tabDetailsTest, tabFundingsTest]));
  const tabsRD$ = createSuccessfulRemoteDataObject$(createPaginatedList([tabPublicationsTest, tabDetailsTest, tabFundingsTest]));

    const noTabsRD = createSuccessfulRemoteDataObject(createPaginatedList([]));
    const noTabsRD$ = createSuccessfulRemoteDataObject$(createPaginatedList([]));

    beforeEach(() => {
      router = TestBed.inject(Router);
      platformId = TestBed.inject(PLATFORM_ID);

      itemService.findById.and.returnValue(createSuccessfulRemoteDataObject$(item));

      hardRedirectService = jasmine.createSpyObj('HardRedirectService', {
        'redirect': jasmine.createSpy('redirect')
      });
    });

    describe('and there tabs', () => {

      describe('when platform is browser', () => {
        beforeEach(() => {

          (tabService as any).findByItem.and.returnValue(tabsRD$);

          spyOn(router, 'navigateByUrl');

          resolver = new CrisItemPageTabResolver(platformId, hardRedirectService, tabService, itemService, router);
        });

        it('should redirect to root route if given tab is the first one', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/publications' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).toHaveBeenCalledWith('/entities/publication/1234-65487-12354-1235');
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should not redirect to root route if tab different than the main one  is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/details' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should not redirect to root route if no tab is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should navigate to 404 if a wrong tab is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/test' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

      it('Should handle tab shortnames with "::" correctly', () => {
        const tabRD = createSuccessfulRemoteDataObject(createPaginatedList([{ ...tabPublicationsTest, shortname: 'publication::details' }]));
        tabService.findByItem.and.returnValue(createSuccessfulRemoteDataObject$(tabRD) as any);

        TestBed.runInInjectionContext(() => {
          return resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/publication::details' } as any);
        });

        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(hardRedirectService.redirect).not.toHaveBeenCalled();
      });
      });

      describe('when platform is server', () => {
        beforeEach(() => {
          platformId = 'server';
          (tabService as any).findByItem.and.returnValue(tabsRD$);

          spyOn(router, 'navigateByUrl');

          resolver = new CrisItemPageTabResolver(platformId, hardRedirectService, tabService, itemService, router);
        });

        it('should redirect to root route if given tab is the first one', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/publications' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                expect(hardRedirectService.redirect).toHaveBeenCalledWith('/entities/publication/1234-65487-12354-1235', 302);
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should not redirect to root route if tab different than the main one  is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/details' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should not redirect to root route if no tab is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });

        it('should navigate to 404 if a wrong tab is given', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235/test' } as any)
            .pipe(take(1))
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).toHaveBeenCalled();
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(resolved).toEqual(tabsRD);
                done();
              }
            );
        });
      });
    });

    describe('and there no tabs', () => {
      beforeEach(() => {

        (tabService as any).findByItem.and.returnValue(noTabsRD$);

        spyOn(router, 'navigateByUrl');

        resolver = new CrisItemPageTabResolver(platformId, hardRedirectService, tabService, itemService, router);
      });

      it('should not redirect nor navigate', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/publication/1234-65487-12354-1235' } as any)
          .pipe(take(1))
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).not.toHaveBeenCalled();
              expect(hardRedirectService.redirect).not.toHaveBeenCalled();
              expect(resolved).toEqual(noTabsRD);
              done();
            }
          );
      });
    });
  });
});
