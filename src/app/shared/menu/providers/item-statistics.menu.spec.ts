import { TestBed } from '@angular/core/testing';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import { ITEM } from '@dspace/core/shared/item.resource-type';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { ItemStatisticsMenuProvider } from './item-statistics.menu';

describe('ItemStatisticsMenuProvider', () => {

  const item: Item = Object.assign(new Item(), {
    id: 'item-uuid',
    uuid: 'item-uuid',
    type: ITEM.value,
    _links: {
      self: {
        href: 'self-link',
      },
    },
  });

  const expectedSections: PartialMenuSection[] = [
    {
      id: 'statistics_item_:item-uuid',
      visible: true,
      parentID: 'statistics',
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.statistics.item',
        link: '/statistics/items/item-uuid/',
      },
    },
  ];

  let provider: ItemStatisticsMenuProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemStatisticsMenuProvider],
    });
    provider = TestBed.inject(ItemStatisticsMenuProvider);
  });

  it('should be created', () => {
	  expect(provider).toBeTruthy();
  });

  describe('getSectionsForContext', () => {
    it('should return the expected item statistics section', (done) => {
      provider.getSectionsForContext(item).subscribe((sections) => {
        expect(sections).toEqual(expectedSections);
        done();
      });
    });
  });

  describe('isApplicable', () => {
    it('should return true for an item', () => {
      expect((provider as any).isApplicable(item)).toBeTrue();
    });

    it('should return false for a non-item dspace object', () => {
      const dso = Object.assign(new DSpaceObject(), { id: 'test-id' });
      expect((provider as any).isApplicable(dso)).toBeFalse();
    });
  });
});


