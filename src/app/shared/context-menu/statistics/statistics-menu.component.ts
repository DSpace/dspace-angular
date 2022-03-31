import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { NotificationsService } from '../../notifications/notifications.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';

@Component({
  selector: 'ds-statistics-menu',
  templateUrl: './statistics-menu.component.html',
  styleUrls: ['./statistics-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COMMUNITY, true)
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION, true)
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM, true)
/**
 * Display a button linking to the edit page of a DSpaceObject
 */
export class StatisticsMenuComponent extends ContextMenuEntryComponent implements OnInit {

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
    private notificationService: NotificationsService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Statistics);
  }

  ngOnInit() {
    this.notificationService.claimedProfile.subscribe(() => {
      this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanViewUsageStatistics, this.contextMenuObject.self, undefined, false);
    });
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
