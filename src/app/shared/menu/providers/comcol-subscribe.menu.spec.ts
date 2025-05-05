import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthRequestService } from 'src/app/core/auth/auth-request.service';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { SubscriptionsDataService } from '../../subscriptions/subscriptions-data.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { SubscribeMenuProvider } from './comcol-subscribe.menu';

describe('SubscribeMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'subscriptions.tooltip',
        function: jasmine.any(Function) as any,
      },
      icon: 'bell',
    },
  ];

  let provider: SubscribeMenuProvider;

  // Agregamos `uuid` para que el servicio pueda obtener la suscripción
  const dso: Collection = Object.assign(new Collection(), {
    uuid: 'mock-uuid',
    _links: { self: { href: 'self-link' } },
  });

  let authorizationService;
  let modalService;

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': observableOf(true),
    });

    modalService = jasmine.createSpyObj('modalService', ['open']);

    TestBed.configureTestingModule({
      providers: [
        SubscribeMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: NgbModal, useValue: modalService },
        {
          provide: AuthService,
          useValue: {
            getAuthenticatedUserFromStore: jasmine.createSpy().and.returnValue(observableOf({ id: 'mock-user-id' })),
          },
        },
        {
          provide: SubscriptionsDataService,
          useValue: {
            getSubscriptionsByPersonDSO: jasmine.createSpy().and.returnValue(observableOf({
              payload: {
                page: [null],
              },
            })),
          },
        },
        { provide: TranslateService, useValue: {} },
        { provide: AuthRequestService, useValue: {} },
      ],
    });

    provider = TestBed.inject(SubscribeMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected sections', (done) => {
      provider.getSectionsForContext(dso)
        .pipe(
          filter((sections) => sections.length > 0),
        )
        .subscribe((sections) => {
          expect(sections).toEqual(expectedSections);
          done();
        });
    });
  });
});
