import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { SubscriptionsDataService } from '@dspace/core/data/subscriptions-data.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import { SubscribeMenuProvider } from './comcol-subscribe.menu';

describe('SubscribeMenuProvider', () => {

  let provider: SubscribeMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    uuid: 'mock-uuid',
    _links: { self: { href: 'self-link' } },
  });

  let authorizationService;
  let modalService;
  let authService;
  let subscriptionsDataService;

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    modalService = jasmine.createSpyObj('modalService', ['open']);

    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: of({ id: 'mock-user-id' }),
    });

    subscriptionsDataService = jasmine.createSpyObj('subscriptionsDataService', {
      getSubscriptionsByPersonDSO: of({ payload: { page: [] } }),
    });

    TestBed.configureTestingModule({
      providers: [
        SubscribeMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: NgbModal, useValue: modalService },
        { provide: AuthService, useValue: authService },
        { provide: SubscriptionsDataService, useValue: subscriptionsDataService },
        { provide: TranslateService, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    provider = TestBed.inject(SubscribeMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return subscribe section when user has no subscription', (done) => {
      provider.getSectionsForContext(dso)
        .pipe()
        .subscribe((sections) => {
          if (sections.length > 0 && sections[0].visible) {
            expect(sections[0].model.type).toBe(MenuItemType.ONCLICK);
            expect((sections[0].model as any).text).toBe('subscriptions.tooltip');
            expect(sections[0].icon).toBe('bell');
            done();
          }
        });
    });

    it('should return manage subscription section when user is already subscribed', (done) => {
      subscriptionsDataService.getSubscriptionsByPersonDSO.and.returnValue(
        of({ payload: { page: [{ id: 'sub-1' }] } }),
      );

      provider.getSectionsForContext(dso)
        .pipe()
        .subscribe((sections) => {
          if (sections.length > 0 && sections[0].visible) {
            expect((sections[0].model as any).text).toBe('subscriptions.manage');
            done();
          }
        });
    });
  });
});
