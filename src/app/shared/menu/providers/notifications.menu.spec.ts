/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PUBLICATION_CLAIMS_PATH } from '../../../admin/admin-notifications/admin-notifications-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { NotificationsMenuProvider } from './notifications.menu';

describe('NotificationsMenuProvider', () => {
  const expectedTopSection: PartialMenuSection = {
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.notifications',
    } as TextMenuItemModel,
    icon: 'bell',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.quality-assurance',
        link: '/notifications/quality-assurance',
      } as LinkMenuItemModel,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.notifications_publication-claim',
        link: '/admin/notifications/' + PUBLICATION_CLAIMS_PATH,
      } as LinkMenuItemModel,
    },
  ];

  let provider: NotificationsMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.callFake((id: FeatureID) => {
      if (id === FeatureID.CanSeeQA || id === FeatureID.AdministratorOf) {
        return of(true);
      } else {
        return of(false);
      }
    });

    TestBed.configureTestingModule({
      providers: [
        NotificationsMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(NotificationsMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getTopSection should return expected menu section', (done) => {
    provider.getTopSection().subscribe((section) => {
      expect(section).toEqual(expectedTopSection);
      done();
    });
  });

  it('getSubSections should return expected menu sections', (done) => {
    provider.getSubSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSubSections);
      done();
    });
  });
});
