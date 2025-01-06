import { PartialMenuSection } from '../menu-provider.model';
import { MenuItemType } from '../menu-item-type.model';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObjectEditMenuProvider } from './dso-edit.menu';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { COLLECTION } from '../../../core/shared/collection.resource-type';

describe('DSpaceObjectEditMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'collection.page.edit',
        link: new URLCombiner('/collections/test-uuid', 'edit', 'metadata').toString(),
      },
      icon: 'pencil-alt',
    }
  ];

  let provider: DSpaceObjectEditMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    uuid: 'test-uuid',
    _links: {self: {href: 'self-link'}},
  });


  let authorizationService;

  beforeEach(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      'isAuthorized': observableOf(true)
    });

    TestBed.configureTestingModule({
      providers: [
        DSpaceObjectEditMenuProvider,
        {provide: AuthorizationDataService, useValue: authorizationService},
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
