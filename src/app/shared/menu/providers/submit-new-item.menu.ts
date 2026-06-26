/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Edit" option in the DSO edit menu
 */
@Injectable()
export class SubmitNewItemMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected authorizationDataService: AuthorizationDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationDataService.isAuthorized(FeatureID.CanSubmit, dso.self),
    ]).pipe(
      map(([canSubmitItem]) => {
        return [
          {
            visible: canSubmitItem && !this.appConfig.collection.showSubmitButton,
            model: {
              type: MenuItemType.LINK,
              text: 'collection.submit.item',
              link: '/submit',
              queryParams: {
                collection: dso.uuid,
              },
            } as LinkMenuItemModel,
            icon: 'plus',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
