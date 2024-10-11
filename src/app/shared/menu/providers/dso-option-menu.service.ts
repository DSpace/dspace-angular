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
import { AbstractExpandableParentMenuProvider } from './expandable-parent-menu-provider';
import { PartialMenuSection } from '../menu-provider';

@Injectable()
export class DsoOptionMenu extends AbstractExpandableParentMenuProvider {

  public getSections(): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: `menu.section.browse_global_communities_and_collections`,
        },
        icon: 'diagram-project'
      },
    ] as PartialMenuSection[]);
  }
}
