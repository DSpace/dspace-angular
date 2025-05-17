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
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { EditMenuProvider } from './edit.menu';

describe('EditMenuProvider', () => {

  const expectedTopSection: PartialMenuSection = {
    accessibilityHandle: 'edit',
    visible: true,
    model: {
      type: MenuItemType.TEXT,
      text: 'menu.section.edit',
    },
    icon: 'pencil',
  };

  const expectedSubSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.edit_community',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: false,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.edit_collection',
        function: jasmine.any(Function) as any,
      },
    },
    {
      visible: true,
      model: {
        type: MenuItemType.ONCLICK,
        text: 'menu.section.edit_item',
        function: jasmine.any(Function) as any,
      },
    },
  ];

  let provider: EditMenuProvider;
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
        EditMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(EditMenuProvider);
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
