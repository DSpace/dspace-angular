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
import {
  Observable,
  of,
} from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider.model';

/**
 * Menu provider to create the "Communities & Collections" menu section in the public navbar.
 *
 * The section is shown only when the {@link https://wiki.lyrasis.org/display/DSDOC9x/ layout.navbar.showCommunityCollection}
 * config flag is enabled. When it is disabled, {@link AdminCommunityListMenuProvider} surfaces the same section in the
 * admin sidebar instead, so the community list stays reachable.
 */
@Injectable()
export class CommunityListMenuProvider extends AbstractMenuProvider {
  protected appConfig = inject(APP_CONFIG);

  /**
   * Whether the "Communities & Collections" link is configured to appear in the public navbar.
   */
  protected get showInNavbar(): boolean {
    return this.appConfig.layout.navbar.showCommunityCollection;
  }

  /**
   * The "Communities & Collections" menu section linking to the community list page.
   */
  protected communityListSection(): PartialMenuSection[] {
    return [
      {
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_communities_and_collections`,
          link: `/community-list`,
        },
        icon: 'diagram-project',
      },
    ];
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return of(this.showInNavbar ? this.communityListSection() : []);
  }
}
