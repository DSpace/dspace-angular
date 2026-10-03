/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';

import { PartialMenuSection } from '../menu-provider.model';
import { CommunityListMenuProvider } from './community-list.menu';

/**
 * Menu provider to create the "Communities & Collections" menu section in the admin sidebar.
 *
 * It is a distinct provider class (extending {@link CommunityListMenuProvider}) so the menu infrastructure resolves it
 * as a separate instance with its own {@link menuID}, independent of the public navbar provider.
 *
 * The section is shown only when the {@link showInNavbar} flag is disabled, so that administrators can still reach the
 * community list when it is hidden from the public navbar.
 */
@Injectable()
export class AdminCommunityListMenuProvider extends CommunityListMenuProvider {
  public getSections(): Observable<PartialMenuSection[]> {
    return of(!this.showInNavbar ? this.communityListSection() : []);
  }
}
