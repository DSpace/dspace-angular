/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { RootDataService } from '@dspace/core/data/root-data.service';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
} from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider.model';

const DSDOC_BASE_URL = 'https://wiki.lyrasis.org/display/DSDOC';
const DSDOC_FALLBACK_URL = `${DSDOC_BASE_URL}/`;

/**
 * Menu provider to create the "Documentation" link in the admin sidebar.
 * The URL is automatically built from the DSpace backend version.
 * Falls back to the generic documentation URL if the version cannot be determined.
 */
@Injectable()
export class DocumentationMenuProvider extends AbstractMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected rootDataService: RootDataService,
  ) {
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.rootDataService.findRoot().pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => of(null)),
      ),
    ]).pipe(
      map(([isSiteAdmin, root]) => {
        const docsUrl = this.buildDocsUrl(root?.dspaceVersion);
        return [
          {
            visible: isSiteAdmin,
            model: {
              type: MenuItemType.EXTERNAL,
              text: 'menu.section.documentation',
              href: docsUrl,
            },
            icon: 'book',
          },
        ] as PartialMenuSection[];
      }),
    );
  }

  private buildDocsUrl(dspaceVersion?: string): string {
    if (!dspaceVersion) {
      return DSDOC_FALLBACK_URL;
    }
    const majorVersion = dspaceVersion.replace(/[^\d.]/g, '').split('.')[0];
    if (!majorVersion) {
      return DSDOC_FALLBACK_URL;
    }
    return `${DSDOC_BASE_URL}${majorVersion}x`;
  }
}
