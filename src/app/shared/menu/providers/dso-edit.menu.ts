/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { getDSORoute } from '../../../app-routing-paths';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MenuItemType } from '../menu-item-type.model';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { PartialMenuSection } from '../menu-provider';
import { DSpaceObjectPageMenuProvider } from './dso.menu';

@Injectable()
export class DSpaceObjectEditMenuProvider extends DSpaceObjectPageMenuProvider<DSpaceObject> {
  constructor(
    protected authorizationDataService: AuthorizationDataService,
    protected dsoDataService: DSpaceObjectDataService,
  ) {
    super(dsoDataService);
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationDataService.isAuthorized(FeatureID.CanEditMetadata, dso.self),
    ]).pipe(
      map(([canEditItem]) => {
        return [
          {
            visible: canEditItem,
            model: {
              type: MenuItemType.LINK,
              text: this.getDsoType(dso) + '.page.edit',
              link: new URLCombiner(getDSORoute(dso), 'edit', 'metadata').toString()
            } as LinkMenuItemModel,
            icon: 'pencil-alt',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
