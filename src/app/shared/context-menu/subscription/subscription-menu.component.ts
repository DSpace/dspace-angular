import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of as observableOf } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { isNotEmpty } from '../../empty.util';


@Component({
  selector: 'ds-subscription-menu',
  templateUrl: './subscription-menu.component.html',
  styleUrls: ['./subscription-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COMMUNITY)
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION)
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
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
   * @param {NgbModal} modalService
   * @param {AuthService} authService
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Subscriptions);
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanSubscribe, this.contextMenuObject.self);
    this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      filter((eperson: EPerson) => isNotEmpty(eperson))
    ).subscribe( (eperson: EPerson) => {
      this.epersonId = eperson.id;
    });
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
