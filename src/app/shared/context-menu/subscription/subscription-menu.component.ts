import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of as observableOf } from 'rxjs';

import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-subscription-menu',
  templateUrl: './subscription-menu.component.html',
  styleUrls: ['./subscription-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COMMUNITY, true)
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION, true)
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM, true)
/**
 * Display a button linking to the subscription of a DSpaceObject
 */
export class SubscriptionMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Whether or not the current user is authorized to subscribe the DSpaceObject
   */
  isAuthorized$: Observable<boolean> = observableOf(false);


  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  types = [
    { name: 'Content', value: 'content' },
    { name: 'Statistics', value: 'statistics' },
    { name: 'Content & Statistics', value: 'content+statistics' },
  ];

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
   * @param {NgbModal} modalService
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private modalService: NgbModal
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Subscriptions);
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanSubscribe, this.contextMenuObject.self);
  }

  /**
   * Open modal
   *
   * @param content
   */
  public openSubscription(content: any) {
    this.modalRef = this.modalService.open(content);
  }

}
