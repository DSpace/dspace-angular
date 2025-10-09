/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  combineLatest as observableCombineLatest,
  map,
  Observable,
  of,
} from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import {
  METADATA_IMPORT_SCRIPT_NAME,
  ScriptDataService,
} from '../../../core/data/processes/script-data.service';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "Import" menu (and subsections) in the admin sidebar
 */
@Injectable()
export class ImportMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected scriptDataService: ScriptDataService,
    protected modalService: NgbModal,
  ) {
    super();
  }

  public getTopSection(): Observable<PartialMenuSection> {
    return of(
      {
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.import',
        },
        icon: 'file-import',
        visible: true,
      },
    );
  }

  public getSubSections(): Observable<PartialMenuSection[]> {
    return observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.scriptDataService.scriptWithNameExistsAndCanExecute(METADATA_IMPORT_SCRIPT_NAME),
    ]).pipe(
      map(([authorized, metadataImportScriptExists]) => {
        return [
          {
            visible: authorized && metadataImportScriptExists,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.import_metadata',
              link: '/admin/metadata-import',
            },
          },
          {
            visible: authorized && metadataImportScriptExists,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.import_batch',
              link: '/admin/batch-import',
            },
          },
        ];
      }),
    );
  }
}
