import { Item } from '../core/shared/item.model';
import { ItemPageResolver } from './item-page.resolver';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthServiceStub } from '../shared/testing/auth-service.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { PLATFORM_ID } from '@angular/core';
import { ItemDataService } from '../core/data/item-data.service';

describe('ItemPageResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{
        path: 'entities/:entity-type/:id',
        component: {} as any
      }])]
    });
  });

  describe('resolve', () => {
    let resolver: ItemPageResolver;
    let itemService: ItemDataService;
    let store: any;
    let router: Router;
    let authService: any;
    let hardRedirectService: HardRedirectService;
    let platformId;

    const uuid = '1234-65487-12354-1235';
    const item = Object.assign(new Item(), {
      id: uuid,
      uuid: uuid,
      metadata: {
        'cris.customurl': [
          {
            value: 'customurl',
          }
        ],
        'dspace.entity.type': [
          {
            value: 'Person'
          }
        ]
      }
    });
    const noMetadataItem = Object.assign(new Item(), {
      id: uuid,
      uuid: uuid,
      metadata: {
        'dspace.entity.type': [
          {
            value: 'Person'
          }
        ]
      }
    });

    describe('When item has custom url', () => {

      beforeEach(() => {
        router = TestBed.inject(Router);
        platformId = TestBed.inject(PLATFORM_ID);
        itemService = {
          findById: (id: string) => createSuccessfulRemoteDataObject$(item)
        } as any;

        store = jasmine.createSpyObj('store', {
          dispatch: {},
        });

        authService = new AuthServiceStub();

        hardRedirectService = jasmine.createSpyObj('HardRedirectService', {
          'redirect': jasmine.createSpy('redirect')
        });

        spyOn(router, 'navigateByUrl');
        resolver = new ItemPageResolver(platformId, hardRedirectService, itemService, store, router, authService);
      });

      it('should resolve a an item from from the item with the url redirect', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).toHaveBeenCalledWith('test-url/customurl');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url redirect subroute', (done) => {
        resolver.resolve({ params: { id: uuid } } as any, { url: 'test-url/1234-65487-12354-1235/edit' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).toHaveBeenCalledWith('test-url/customurl/edit');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url custom url and should not redirect', (done) => {
        resolver.resolve({ params: { id: 'customurl' } } as any, { url: '/entities/person/customurl' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(router.navigateByUrl).not.toHaveBeenCalledWith('/entities/person/customurl');
              done();
            }
          );
      });

      it('should resolve a an item from from the item with the url custom url and should not redirect', (done) => {
        resolver.resolve({ params: { id: 'customurl' } } as any, { url: '/entities/person/customurl/edit' } as any)
          .pipe(first())
          .subscribe(
            (resolved) => {
              expect(hardRedirectService.redirect).not.toHaveBeenCalledWith('/entities/person/customurl/edit');
              done();
            }
          );
      });

    });

    describe('When item has no custom url', () => {

      beforeEach(() => {
        router = TestBed.inject(Router);
        itemService = {
          findById: (id: string) => createSuccessfulRemoteDataObject$(noMetadataItem)
        } as any;

        store = jasmine.createSpyObj('store', {
          dispatch: {},
        });

        authService = new AuthServiceStub();

        hardRedirectService = jasmine.createSpyObj('HardRedirectService', {
          'redirect': jasmine.createSpy('redirect')
        });

        spyOn(router, 'navigateByUrl');
      });

      describe(' and platform is server', () => {

        beforeEach(() => {
          platformId = 'server';
          resolver = new ItemPageResolver(platformId, hardRedirectService, itemService, store, router, authService);
        });

        it('should redirect if it has not the new item url', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/items/1234-65487-12354-1235/edit' } as any)
            .pipe(first())
            .subscribe(
              (resolved) => {
                expect(hardRedirectService.redirect).toHaveBeenCalledWith('/entities/person/1234-65487-12354-1235/edit', 301);
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                done();
              }
            );
        });

        it('should not redirect if it has the new item url', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/person/1234-65487-12354-1235/edit' } as any)
            .pipe(first())
            .subscribe(
              (resolved) => {
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                done();
              }
            );
        });
      });

      describe(' and platform is browser', () => {

        beforeEach(() => {
          platformId = 'browser';
          authService = new AuthServiceStub();
          resolver = new ItemPageResolver(platformId, hardRedirectService, itemService, store, router, authService);
        });

        it('should redirect if it has not the new item url', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/items/1234-65487-12354-1235/edit' } as any)
            .pipe(first())
            .subscribe(
              (resolved) => {
                expect(router.navigateByUrl).toHaveBeenCalledWith('/entities/person/1234-65487-12354-1235/edit');
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                done();
              }
            );
        });

        it('should not redirect if it has the new item url', (done) => {
          resolver.resolve({ params: { id: uuid } } as any, { url: '/entities/person/1234-65487-12354-1235/edit' } as any)
            .pipe(first())
            .subscribe(
              (resolved) => {
                expect(hardRedirectService.redirect).not.toHaveBeenCalled();
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                done();
              }
            );
        });
      });


    });

  });
});
