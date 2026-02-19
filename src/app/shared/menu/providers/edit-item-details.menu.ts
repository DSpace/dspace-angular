/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  getAllSucceededRemoteDataPayload,
  getPaginatedListPayload,
} from '@dspace/core/shared/operators';
import { EditItemDataService } from '@dspace/core/submission/edititem-data.service';
import { EditItemMode } from '@dspace/core/submission/models/edititem-mode.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import {
  map,
  Observable,
} from 'rxjs';
import { startWith } from 'rxjs/operators';

import { getEditItemPageRoute } from '../../../app-routing-paths';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Edit details" option in the DSO audit menu
 */
@Injectable()
export class EditItemDetailsMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected editItemService: EditItemDataService,
  ) {
    super();
  }


  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.editItemService.searchEditModesById(dso.id).pipe(
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      map((editModes: EditItemMode[]) => {
        return editModes.map(editMode => {
          return {
            model: {
              type: MenuItemType.LINK,
              text: `menu.section.${editMode.name}`,
              link: new URLCombiner(getEditItemPageRoute(), `${dso.uuid}:${editMode.name}`).toString(),
            },
            visible: true,
          };
        });
      }),
    );
  }

}
