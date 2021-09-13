import { Component, Inject, OnInit } from '@angular/core';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { AuthService } from '../../../core/auth/auth.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EPerson } from '../../../core/eperson/models/eperson.model';


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
   * Whether or not the current user is authorized to edit the DSpaceObject
   */
  isAuthorized$: Observable<boolean> = observableOf(true);


  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  types = [
    {name: 'Content' ,value: 'content'},
    {name: 'Statistics' ,value: 'statistics'},
    {name: 'Content & Statistics' ,value: 'content+statistics'},
  ];

  /**
   * EPerson id of the logged user
   */
  eperson: string;

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
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private authService: AuthService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  ngOnInit() {
    // this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.contextMenuObject.self);
    this.authService.getAuthenticatedUserFromStore().pipe(take(1)).subscribe( (eperson: EPerson) => {
      this.eperson = eperson.id;
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
