import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterModule,
} from '@angular/router';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { MetadataValueFilter } from '@dspace/core/shared/metadata.models';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { first } from 'rxjs/operators';

import { itemPageResolver } from './item-page.resolver';

describe('itemPageResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: HardRedirectService, useValue: {} },
      ],
      imports: [RouterModule.forRoot([{
        path: 'entities/:entity-type/:id',
        component: {} as any,
      }])],
    });
  });

  describe('resolve', () => {
    let resolver: any;
    let itemService: any;
    let store: any;
    let router: Router;
    let authService: AuthServiceStub;
    let platformId: any;
    let hardRedirectService: any;
    let notificationsService: NotificationsServiceStub;
    let translateService: any;

    const uuid = '1234-65487-12354-1235';
    let item: DSpaceObject;

    function runTestsWithEntityType(entityType: string) {
      beforeEach(() => {
        router = TestBed.inject(Router);
        platformId = TestBed.inject(PLATFORM_ID);
        hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
          redirect: {},
        });
        notificationsService = new NotificationsServiceStub();
        translateService = { instant: (key: string) => key } as any;
        item = Object.assign(new DSpaceObject(), {
          uuid: uuid,
          firstMetadataValue(_keyOrKeys: string | string[], _valueFilter?: MetadataValueFilter): string {
            return entityType;
          },
        });
        itemService = {
          findByIdOrCustomUrl: (_id: string) => createSuccessfulRemoteDataObject$(item),
        };
        store = jasmine.createSpyObj('store', {
          dispatch: {},
        });
        authService = new AuthServiceStub();
        resolver = itemPageResolver;
      });

      it('should redirect to the correct route for the entity type', (done) => {
        spyOn(item, 'firstMetadataValue').and.returnValue(entityType);
        spyOn(router, 'navigateByUrl').and.callThrough();

        resolver({ params: { id: uuid } } as any,
          { url: router.parseUrl(`/items/${uuid}`).toString() } as any,
          router,
          itemService,
          store,
          authService,
          platformId,
          hardRedirectService,
          notificationsService,
          translateService,
        ).pipe(first())
          .subscribe(
            () => {
              expect(router.navigateByUrl).toHaveBeenCalledWith(router.parseUrl(`/entities/${entityType}/${uuid}`).toString());
              done();
            },
          );
      });

      it('should not redirect if we\'re already on the correct route', (done) => {
        spyOn(item, 'firstMetadataValue').and.returnValue(entityType);
        spyOn(router, 'navigateByUrl').and.callThrough();

        resolver(
          { params: { id: uuid } } as any,
          { url: router.parseUrl(`/entities/${entityType}/${uuid}`).toString() } as any,
          router,
          itemService,
          store,
          authService,
          platformId,
          hardRedirectService,
          notificationsService,
          translateService,
        ).pipe(first())
          .subscribe(
            () => {
              expect(router.navigateByUrl).not.toHaveBeenCalled();
              done();
            },
          );
      });
    }

    describe('when normal entity type is provided', () => {
      runTestsWithEntityType('publication');
    });

    describe('when entity type contains a special character', () => {
      runTestsWithEntityType('alligator,loki');
      runTestsWithEntityType('🐊');
      runTestsWithEntityType(' ');
    });

  });

  describe('when item has dspace.customurl metadata', () => {

    const customUrl = 'my-custom-item';
    let resolver: any;
    let itemService: any;
    let store: any;
    let router: Router;
    let authService: AuthServiceStub;
    let platformId: any;
    let hardRedirectService: any;
    let notificationsService: NotificationsServiceStub;
    let translateService: any;

    const uuid = '1234-65487-12354-1235';
    let item: DSpaceObject;

    beforeEach(() => {
      router = TestBed.inject(Router);
      platformId = TestBed.inject(PLATFORM_ID);
      hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
        redirect: {},
      });
      notificationsService = new NotificationsServiceStub();
      translateService = { instant: (key: string) => key } as any;
      item = Object.assign(new DSpaceObject(), {
        uuid: uuid,
        id: uuid,
        firstMetadataValue(_keyOrKeys: string | string[], _valueFilter?: MetadataValueFilter): string {
          return _keyOrKeys === 'dspace.entity.type' ? 'person' : customUrl;
        },
        hasMetadata(_keyOrKeys: string | string[], _valueFilter?: MetadataValueFilter): boolean {
          return true;
        },
        metadata: {
          'dspace.customurl': customUrl,
        },
      });
      itemService = {
        findByIdOrCustomUrl: (_id: string) => createSuccessfulRemoteDataObject$(item),
      };
      store = jasmine.createSpyObj('store', {
        dispatch: {},
      });
      authService = new AuthServiceStub();
      resolver = itemPageResolver;
    });

    it('should navigate to the new custom URL if dspace.customurl is defined and different from route param', (done) => {
      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: uuid } } as any;
      const state = { url: `/entities/person/${uuid}` } as any;

      resolver(route, state, router, itemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe((rd: any) => {
          const expectedUrl = `/entities/person/${customUrl}`;
          expect(router.navigateByUrl).toHaveBeenCalledWith(expectedUrl);
          done();
        });
    });

    // FIX #5479: uses state.url with /edit to detect navigation from edit/administer page
    it('should not navigate to custom URL if coming from edit page', (done) => {
      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: uuid } } as any;
      const state = { url: `/entities/person/${uuid}/edit` } as any;

      resolver(route, state, router, itemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe(() => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
    });

    it('should not navigate if dspace.customurl matches the current route id', (done) => {
      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: customUrl } } as any;
      const state = { url: `/entities/person/${customUrl}` } as any;

      resolver(route, state, router, itemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe((rd: any) => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
    });

    it('should replace dspace.customurl if the current route is a sub path (/full excluded)', (done) => {
      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: customUrl } } as any;
      const state = { url: `/entities/person/${customUrl}/edit` } as any;

      resolver(route, state, router, itemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith(`/entities/person/${uuid}/edit`);
          done();
        });
    });

    it('should not replace dspace.customurl if the current sub path is /full', (done) => {
      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: customUrl } } as any;
      const state = { url: `/entities/person/${customUrl}/full` } as any;

      resolver(route, state, router, itemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe(() => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          done();
        });
    });

    // FIX #5479: invalid custom URL characters should fall back to UUID routing
    it('should fall back to UUID and show a warning notification when dspace.customurl contains invalid characters', (done) => {
      const invalidCustomUrl = 'café-测试';
      const itemWithInvalidUrl = Object.assign(new DSpaceObject(), {
        uuid: uuid,
        id: uuid,
        firstMetadataValue(_keyOrKeys: string | string[], _valueFilter?: MetadataValueFilter): string {
          return _keyOrKeys === 'dspace.entity.type' ? 'person' : invalidCustomUrl;
        },
        hasMetadata(_keyOrKeys: string | string[], _valueFilter?: MetadataValueFilter): boolean {
          return true;
        },
        metadata: { 'dspace.customurl': invalidCustomUrl },
      });
      const invalidItemService = {
        findByIdOrCustomUrl: (_id: string) => createSuccessfulRemoteDataObject$(itemWithInvalidUrl),
      };
      notificationsService = new NotificationsServiceStub();
      translateService = { instant: (key: string) => key } as any;

      spyOn(router, 'navigateByUrl').and.callThrough();

      const route = { params: { id: uuid } } as any;
      const state = { url: `/items/${uuid}` } as any;

      resolver(route, state, router, invalidItemService, store, authService, platformId, hardRedirectService, notificationsService, translateService)
        .pipe(first())
        .subscribe(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith(`/entities/person/${uuid}`);
          expect(notificationsService.warning).toHaveBeenCalled();
          done();
        });
    });

  });

});
