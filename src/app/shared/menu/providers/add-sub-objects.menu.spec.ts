import { TestBed } from '@angular/core/testing';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Community } from '@dspace/core/shared/community.model';
import { COMMUNITY } from '@dspace/core/shared/community.resource-type';
import { of } from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectEditMenuProvider } from './dso-edit.menu';

describe('DSpaceObjectEditMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'community.add.sub-community',
        link: '/communities/create',
        queryParams: {
          parent: 'test-uuid',
        },
      },
      icon: 'plus',
    },
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'community.add.sub-collection',
        link: '/collections/create',
        queryParams: {
          parent: 'test-uuid',
        },
      },
      icon: 'plus',
    },
  ];

  let provider: DSpaceObjectEditMenuProvider;

  const dso: Community = Object.assign(new Community(), {
    type: COMMUNITY.value,
    uuid: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });


  let authorizationService;

  beforeEach(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': of(true),
    });

    TestBed.configureTestingModule({
      providers: [
        DSpaceObjectEditMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
    });
    provider = TestBed.inject(DSpaceObjectEditMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected sections', (done) => {
      provider.getSectionsForContext(dso).subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });

});
