import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DsoVersioningModalService } from '../../dso-page/dso-versioning-modal-service/dso-versioning-modal.service';

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
  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
   * @param {DsoVersioningModalService} versioningModalService
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private versioningModalService: DsoVersioningModalService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ItemVersion);
  }

  ngOnInit() {
    const isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.contextMenuObject.self);
    const isDisabled$ = this.versioningModalService.isNewVersionButtonDisabled(this.contextMenuObject);

    combineLatest([isAuthorized$, isDisabled$]).pipe(
      take(1)
    ).subscribe(([isAuthorized, isDisabled]) => {
      this.canShow$.next(isAuthorized && !isDisabled);
    });

  }

  /**
   * Open modal to create a new version
   */
  createNewVersion(): void {
    this.versioningModalService.openCreateVersionModal(this.contextMenuObject);
  }
}
