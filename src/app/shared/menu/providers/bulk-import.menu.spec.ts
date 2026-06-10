
import { TestBed } from '@angular/core/testing';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { COLLECTION } from '@dspace/core/shared/collection.resource-type';
import { AuthorizationDataServiceStub } from '@dspace/core/testing/authorization-service.stub';
import { of } from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { BulkImportMenuProvider } from './bulk-import.menu';

describe('BulkImportMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'context-menu.actions.bulk-import.btn',
        link: '/bulk-import/test-uuid',
      },
    },
  ];

  let provider: BulkImportMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    id: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });


  let authorizationServiceStub = new AuthorizationDataServiceStub();

  beforeEach(() => {
    spyOn(authorizationServiceStub, 'isAuthorized').and.returnValue(
      of(true),
    );
    TestBed.configureTestingModule({
      providers: [
        BulkImportMenuProvider,
        { provide: AuthorizationDataService, useValue: authorizationServiceStub },
      ],
    });
    provider = TestBed.inject(BulkImportMenuProvider);
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
