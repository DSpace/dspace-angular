import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { MenuService } from '../menu.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { ClaimMenuProvider } from './item-claim.menu';

describe('ClaimMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'item.page.claim.button',
        function: jasmine.any(Function) as any,
      },
      icon: 'hand-paper',
    },
  ];

  let provider: ClaimMenuProvider;

  const item: Item = Object.assign(new Item(), {
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item',
      }],
    },

  });
  const person: Item = Object.assign(new Item(), {
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Person Entity',
      }],
      'dspace.entity.type': [{
        'value': 'Person',
      }],
    },
  });


  let authorizationService;
  let menuService;
  let notificationsService;
  let researcherProfileService;
  let modalService;


  beforeEach(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': of(true),
      'invalidateAuthorizationsRequestCache': {},
    });

    menuService = jasmine.createSpyObj('menuService', ['hideMenuSection']);

    notificationsService = new NotificationsServiceStub();

    researcherProfileService = jasmine.createSpyObj('authorizationService', {
      'createFromExternalSourceAndReturnRelatedItemId': of('profile-id'),
    });

    modalService = jasmine.createSpyObj('modalService', ['open']);


    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        ClaimMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: MenuService, useValue: menuService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: ResearcherProfileDataService, useValue: researcherProfileService },
        { provide: NgbModal, useValue: modalService },
      ],
    });
    provider = TestBed.inject(ClaimMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected sections', (done) => {
      provider.getSectionsForContext(person).subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });

  describe('isApplicable', () => {
    it('should return true whe the provided dspace object is a person entity', () => {
      const result = (provider as any).isApplicable(person);
      expect(result).toBeTrue();
    });
    it('should return true whe the provided dspace object is not a person entity', () => {
      const result = (provider as any).isApplicable(item);
      expect(result).toBeFalse();
    });
  });

  describe('claimResearcher', () => {
    it('should show a success notification and hide the menu when an id is returned by the researcher profile service', () => {
      (provider as any).claimResearcher(person);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(authorizationService.invalidateAuthorizationsRequestCache).toHaveBeenCalled();
      expect(menuService.hideMenuSection).toHaveBeenCalled();
    });
    it('should show an error notification when no id is returned by the researcher profile service', () => {
      (researcherProfileService.createFromExternalSourceAndReturnRelatedItemId as jasmine.Spy).and.returnValue(of(null));
      (provider as any).claimResearcher(person);
      expect(notificationsService.error).toHaveBeenCalled();
      expect(authorizationService.invalidateAuthorizationsRequestCache).not.toHaveBeenCalled();
      expect(menuService.hideMenuSection).not.toHaveBeenCalled();
    });
  });
});
