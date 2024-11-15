/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { combineLatest, Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDSORoute } from '../../../app-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { MenuItemType } from '../menu-item-type.model';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the Orcid synchronisation menu section on person entity pages
 */
@Injectable()
export class OrcidMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  protected isApplicable(item: Item): boolean {
    if (item instanceof Item) {
      return this.getDsoType(item) === 'person';
    }
    return false;
  }

  public getSectionsForContext(item: Item): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanSynchronizeWithORCID, item.self),
    ]).pipe(
      map(([canSynchronizeWithOrcid]) => {
        return [
          {
            visible: canSynchronizeWithOrcid,
            model: {
              type: MenuItemType.LINK,
              text: 'item.page.orcid.tooltip',
              link: new URLCombiner(getDSORoute(item), 'orcid').toString()
            } as LinkMenuItemModel,
            icon: 'orcid fab fa-lg',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
