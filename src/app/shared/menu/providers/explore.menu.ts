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
import { isEmpty } from '@dspace/shared/utils/empty.util';
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
   * Retrieves the explore menu sections by fetching the visible sections from the backend.
   *
   * A section without nested sections is rendered as a flat link. A section that has nested sections is rendered as an
   * expandable navbar section: a top (text) section plus a link for each nested section, so it renders as a
   * `ds-expandable-navbar-section`.
   *
   * Returns an empty array when explore pages are disabled in the app configuration.
   */
  getSections(): Observable<PartialMenuSection[]> {
    if (!this.appConfig.layout.enableExplorePages) {
      return of([]);
    }
    return this.sectionDataService.findVisibleSections().pipe(
      getFirstSucceededRemoteData(),
      map((rd: RemoteData<PaginatedList<Section>>) => {
        return rd.payload.page.reduce((sections: PartialMenuSection[], section: Section) => {
          return [
            ...sections,
            ...this.sectionToMenuSections(section),
          ];
        }, [] as PartialMenuSection[]);
      }),
    );
  }

  /**
   * Convert a single visible {@link Section} into one or more {@link PartialMenuSection}s.
   * - Without nested sections: a single flat link section.
   * - With nested sections: an expandable top section plus one child link per nested section.
   *
   * @param section the visible section to convert
   */
  protected sectionToMenuSections(section: Section): PartialMenuSection[] {
    if (isEmpty(section.nestedSections)) {
      return [this.exploreLinkSection(section.id)];
    }

    const parentID = `${this.menuProviderId}_${section.id}`;
    const childSections: PartialMenuSection[] = section.nestedSections.map((nestedSection: Section) => ({
      ...this.exploreLinkSection(nestedSection.id),
      id: `${parentID}_${nestedSection.id}`,
      parentID,
      alwaysRenderExpandable: false,
    }));

    const topSection: PartialMenuSection = {
      id: parentID,
      visible: true,
      model: {
        type: MenuItemType.TEXT,
        text: `menu.section.explore_${section.id}`,
      },
      alwaysRenderExpandable: true,
    };

    return [
      ...childSections,
      topSection,
    ];
  }

  /**
   * Build a flat link menu section pointing to the explore page of the given section id.
   *
   * @param id the section id used for both the i18n label and the route
   */
  protected exploreLinkSection(id: string): PartialMenuSection {
    return {
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: `menu.section.explore_${id}`,
        link: `/explore/${id}`,
      },
    };
  }
}
