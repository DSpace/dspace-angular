import { Component, Inject, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';


@Component({
  selector: 'ds-item-version-menu',
  templateUrl: './item-version-menu.component.html',
  styleUrls: ['./item-version-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
/**
 * Display a button linking to the item versioning of a DSpaceObject
 */
export class ItemVersionMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Whether or not the current user is authorized to subscribe the DSpaceObject
   */
  isAuthorized$: Observable<boolean> = observableOf(false);

  /**
   * EPerson id of the logged user
   */
  epersonId: string;

  /**
   * DSpaceObject that is being viewed
   */
  dso: DSpaceObject;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {AuthService} authService
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private authService: AuthService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ItemVersion);
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.contextMenuObject.self);
  }

}
