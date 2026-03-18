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
    of
} from 'rxjs';

import { AuthorizationDataService } from '../../../../../../app/core/data/feature-authorization/authorization-data.service';
import { MenuItemType } from '../../../../../../app/shared/menu/menu-item-type.model';
import {
    AbstractMenuProvider,
    PartialMenuSection,
} from '../../../../../../app/shared/menu/menu-provider.model';

/**
 * Menu provider to create the "Admin Dashboard" menu section in the public navbar under Statistics.
 */
@Injectable({ providedIn: 'root' })
export class AdminDashboardMenuProvider extends AbstractMenuProvider {

    constructor(
        protected authorizationService: AuthorizationDataService,
    ) {
        super();
    }

    public getSections(): Observable<PartialMenuSection[]> {
        return of([
            {
                id: 'admin-dashboard',
                visible: true,
                model: {
                    type: MenuItemType.LINK,
                    text: 'menu.section.analytics',
                    link: '/statistics/admin-dashboard',
                },
                icon: 'chart-bar',
            },
        ]);
    }
}
