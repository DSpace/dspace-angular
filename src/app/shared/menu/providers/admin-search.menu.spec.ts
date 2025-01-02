/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { TestBed } from '@angular/core/testing';
import { MenuItemType } from '../menu-item-type.model';
import { AdminSearchMenuProvider } from './admin-search.menu';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { PartialMenuSection } from '../menu-provider.model';

const expectedSections: PartialMenuSection[] = [
  {
    visible: true,
    model: {
      type: MenuItemType.LINK,
      text: 'menu.section.admin_search',
      link: '/admin/search',
    },
    icon: 'search',
  },
];

describe('AdminSearchMenuProvider', () => {
  let provider: AdminSearchMenuProvider;
  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      observableOf(true)
    );

    TestBed.configureTestingModule({
      providers: [
        AdminSearchMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(AdminSearchMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  it('getSections should return expected menu sections', (done) => {
    provider.getSections().subscribe((sections) => {
      expect(sections).toEqual(expectedSections);
      done();
    });
  });
});
