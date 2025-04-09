import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

@Component({
  selector: 'ds-dso-page-edit-menu',
  templateUrl: './dso-page-edit-menu.component.html',
  styleUrls: ['./dso-page-edit-menu.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Display a button linking to the edit page of a DSpaceObject
 */
export class DsoPageEditMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Whether or not the current user is authorized to edit the DSpaceObject
   */
  isAuthorized$: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param notificationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EditDSO);
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.contextMenuObject.self, undefined, false);
  }

  /**
   * Return the prefix of the route to the edit page (before the object's UUID, e.g. "items")
   */
  getPageRoutePrefix(): string {
    let routePrefix;
    switch (this.contextMenuObjectType) {
      case DSpaceObjectType.COMMUNITY:
        routePrefix = 'communities';
        break;
      case DSpaceObjectType.COLLECTION:
        routePrefix = 'collections';
        break;
      case DSpaceObjectType.ITEM:
        routePrefix = 'items';
        break;
    }
    return routePrefix;
  }

}
