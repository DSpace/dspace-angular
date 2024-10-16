/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { hasValue } from '../../empty.util';

@Injectable()
export class DsoOptionMenu extends DSpaceObjectPageMenuProvider {

  alwaysRenderExpandable = true;

  protected isApplicable(dso: DSpaceObject): boolean {
    return hasValue(dso);
  }

  getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: this.getDsoType(dso) + '.page.options',
        },
        icon: 'ellipsis-vertical'
      },
    ] as PartialMenuSection[]);
  }
}
