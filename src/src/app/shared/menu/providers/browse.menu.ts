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
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { BrowseService } from '../../../core/browse/browse.service';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { BrowseDefinition } from '../../../core/shared/browse-definition.model';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "All of DSpace" browse menu sections in the public navbar
 */
@Injectable()
export class BrowseMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected browseService: BrowseService,
  ) {
    super();
  }

  getTopSection(): Observable<PartialMenuSection> {
    return of(
      {
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.browse_global',
        } as TextMenuItemModel,
        icon: 'globe',
        visible: true,
      },
    );
  }

  /**
   * Retrieves subsections by fetching the browse definitions from the backend and mapping them to partial menu sections.
   */
  getSubSections(): Observable<PartialMenuSection[]> {
    return this.browseService.getBrowseDefinitions().pipe(
      getFirstSucceededRemoteData(),
      map((rd: RemoteData<PaginatedList<BrowseDefinition>>) => {
        return [
          ...rd.payload.page.map((browseDef) => {
            return {
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.browse_global_by_${browseDef.id}`,
                link: `/browse/${browseDef.id}`,
              },
            };
          }),
          {
            visible: this.appConfig.geospatialMapViewer.enableBrowseMap,
            model: {
              type: MenuItemType.LINK,
              text: `menu.section.browse_global_geospatial_map`,
              link: `/browse/map`,
            },
          },
        ];
      }),
    );
  }
}
