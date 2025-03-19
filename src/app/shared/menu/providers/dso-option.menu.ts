/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Options" menu wrapper on the DSO pages.
 * This section will be rendered as a button on the DSO pages if sub providers have been added.
 */
@Injectable()
export class DsoOptionMenuProvider extends DSpaceObjectPageMenuProvider {

  alwaysRenderExpandable = true;

  getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: this.getDsoType(dso) + '.page.options',
        },
        icon: 'ellipsis-vertical',
      },
    ] as PartialMenuSection[]);
  }
}
