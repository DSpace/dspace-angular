/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { CoarNotifyMenuProvider } from './coar-notify.menu';

describe('CoarNotifyMenuProvider', () => {
  const expectedTopSection: PartialMenuSection = {
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.coar_notify',
    } as TextMenuItemModel,
    icon: 'inbox',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.notify_dashboard',
        link: '/admin/notify-dashboard',
      } as LinkMenuItemModel,
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.services',
        link: '/admin/ldn/services',
      } as LinkMenuItemModel,
    },
  ];

  let provider: CoarNotifyMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {

    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      of(true),
    );
    TestBed.configureTestingModule({
      providers: [
        CoarNotifyMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(CoarNotifyMenuProvider);
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
