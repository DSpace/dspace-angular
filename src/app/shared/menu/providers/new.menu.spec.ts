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
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { NewMenuProvider } from './new.menu';

describe('NewMenuProvider', () => {
  const expectedTopSection: PartialMenuSection = {
    accessibilityHandle: 'new',
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.new',
    },
    icon: 'plus',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.new_community',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: false,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.new_collection',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.new_item',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.new_process',
        link: '/processes/new',
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.services_new',
        link: '/admin/ldn/services/new',
      } as LinkMenuItemModel,
      icon: '',
    },
  ];

  let provider: NewMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.callFake((id: FeatureID) => {
      if (id === FeatureID.IsCollectionAdmin) {
        return of(false);
      } else {
        return of(true);
      }
    });

    TestBed.configureTestingModule({
      providers: [
        NewMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(NewMenuProvider);
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
