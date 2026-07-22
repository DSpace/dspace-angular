/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  inject,
  Injectable,
} from '@angular/core';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { SectionDataService } from '@dspace/core/data/section-data.service';
import { Section } from '@dspace/core/layout/models/section.model';
import { getFirstSucceededRemoteData } from '@dspace/core/shared/operators';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider.model';

/**
 * Menu provider to create the explore menu sections in the public navbar.
 * Returns an empty menu when `layout.enableExplorePages` is false.
 */
@Injectable()
export class ExploreMenuProvider extends AbstractMenuProvider {
  protected appConfig = inject(APP_CONFIG);

  constructor(
    protected sectionDataService: SectionDataService,
  ) {
    super();
  }

  /**
   * Retrieves subsections by fetching the browse definitions from the backend and mapping them to partial menu sections.
   * Returns an empty array when explore pages are disabled in the app configuration.
   */
  getSections(): Observable<PartialMenuSection[]> {
    if (!this.appConfig.layout.enableExplorePages) {
      return of([]);
    }
    return this.sectionDataService.findVisibleSections().pipe(
      getFirstSucceededRemoteData(),
      map((rd: RemoteData<PaginatedList<Section>>) => {
        return [
          ...rd.payload.page.map((browseDef) => {
            return {
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.explore_${browseDef.id}`,
                link: `/explore/${browseDef.id}`,
              },
            };
          }),
        ];
      }),
    );
  }
}
