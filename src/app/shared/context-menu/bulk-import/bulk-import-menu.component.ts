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
import { switchMap } from 'rxjs/operators';

import { getBulkImportRoute } from '../../../app-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './bulk-import-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
export class BulkImportMenuComponent extends ContextMenuEntryComponent implements OnInit {

  isCollectionAdmin$: Observable<boolean>;

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
    private notificationService: NotificationsService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.BulkImport);
  }
  ngOnInit() {
    this.isCollectionAdmin$ = this.notificationService.claimedProfile.pipe(
      switchMap(() => this.isCollectionAdmin(false)),
    );
  }

  /**
   * Get bulk import route
   */
  getBulkImportPageRouterLink() {
    return getBulkImportRoute(this.contextMenuObject as Collection);
  }

  /**
   * Check if user is administrator for this collection
   */
  isCollectionAdmin(useCacheVersion = true): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined, useCacheVersion);
  }
}
