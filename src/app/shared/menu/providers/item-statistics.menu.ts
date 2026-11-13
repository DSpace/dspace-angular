import { Injectable } from '@angular/core';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  Observable,
  of,
} from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the item-specific statistics option in the public statistics menu.
 */
@Injectable()
export class ItemStatisticsMenuProvider extends DSpaceObjectPageMenuProvider {

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return of([
      {
        id: `statistics_item_:${dso.id}`,
        visible: true,
        parentID: 'statistics',
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.statistics.item',
          link: `/statistics/items/${dso.id}/`,
        },
      },
    ]);
  }

  protected isApplicable(dso: DSpaceObject): boolean {
    return dso instanceof Item;
  }
}

