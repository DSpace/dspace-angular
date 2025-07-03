import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../../core/shared/item.model';
import { ITEM } from '../../../core/shared/item.resource-type';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { OrcidMenuProvider } from './item-orcid.menu';

describe('OrcidMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'item.page.orcid.tooltip',
        link: new URLCombiner('/entities/person/test-uuid', 'orcid').toString(),
      },
      icon: 'orcid fab fa-lg',
    },
  ];

  let provider: OrcidMenuProvider;

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
    uuid: 'test-uuid',
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

  beforeEach(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': of(true),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        OrcidMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
    });
    provider = TestBed.inject(OrcidMenuProvider);
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

});
