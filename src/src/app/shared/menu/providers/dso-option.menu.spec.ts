import { TestBed } from '@angular/core/testing';

import { Collection } from '../../../core/shared/collection.model';
import { COLLECTION } from '../../../core/shared/collection.resource-type';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DsoOptionMenuProvider } from './dso-option.menu';

describe('DsoOptionMenuProvider', () => {

  const expectedSections: PartialMenuSection[] = [
    {
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: 'collection.page.options',
      },
      icon: 'ellipsis-vertical',
    },
  ];

  let provider: DsoOptionMenuProvider;

  const dso: Collection = Object.assign(new Collection(), {
    type: COLLECTION.value,
    uuid: 'test-uuid',
    _links: { self: { href: 'self-link' } },
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DsoOptionMenuProvider,
      ],
    });
    provider = TestBed.inject(DsoOptionMenuProvider);
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
