/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { EditItemDataService } from '@dspace/core/submission/edititem-data.service';
import { EditItemMode } from '@dspace/core/submission/models/edititem-mode.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import {
  catchError,
  map,
  Observable,
  of,
} from 'rxjs';

import { getEditItemPageRoute } from '../../../app-routing-paths';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Edit" option in the DSO audit menu
 */
@Injectable()
export class EditItemMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected editItemService: EditItemDataService,
  ) {
    super();
  }


  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.editItemService.searchEditModesById(dso.id).pipe(
      getFirstCompletedRemoteData(),
      map((editmodesRd: RemoteData<PaginatedList<EditItemMode>>) => {
        if (editmodesRd.hasSucceeded) {
          const editModes = editmodesRd.payload.page;
          return editModes.map(editMode => {
            return {
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.${editMode.name}`,
                link: new URLCombiner(getEditItemPageRoute(), `${dso.uuid}:${editMode.name}`).toString(),
              },
              icon: 'pencil-alt',
              visible: true,
            };
          });
        } else  {
          return [];
        }
      }),
      catchError(() => of([])),
    );
  }

}
