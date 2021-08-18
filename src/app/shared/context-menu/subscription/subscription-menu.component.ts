import { Component, Inject, OnInit } from '@angular/core';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { FormGroup, FormControl,FormArray, FormBuilder } from '@angular/forms';

import { SubscriptionService } from '../../subscriptions/subscription.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/models/notification-type';
import { NotificationOptions } from '../../notifications/models/notification-options.model';


@Component({
  selector: 'ds-subscription-menu',
  templateUrl: './subscription-menu.component.html',
  styleUrls: ['./subscription-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.COMMUNITY)
@rendersContextMenuEntriesForType(DSpaceObjectType.COLLECTION)
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
/**
 * Display a button linking to the edit page of a DSpaceObject
 */
export class SubscriptionMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Whether or not the current user is authorized to edit the DSpaceObject
   */
  isAuthorized$: Observable<boolean>;

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  types = [
    {name: 'Content' ,value: 'content'},
    {name: 'Statistics' ,value: 'statistics'},
    {name: 'Content & Statistics' ,value: 'content+statistics'},
  ];

  eperson = '123123123123';

  subscriptionForm: FormGroup;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private modalService: NgbModal,
    private formGroup: FormBuilder,
    private notificationsService: NotificationsService,
    private subscriptionService: SubscriptionService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanEditMetadata, this.contextMenuObject.self);
    this.initSubscription();
  }

  /**
   * Open modal
   *
   * @param content
   */
  public openSubscription(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Return the prefix of the route to the edit page (before the object's UUID, e.g. 'items')
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

  initSubscription() {
    this.processing$.next(true);
    this.getSubscription(this.eperson, this.injectedContextMenuObject.uuid).subscribe( (res) => {
        this.subscriptionForm = this.formGroup.group({
          id: res.id,
          subscriptionType: res.subscriptionType,
          subscriptionParameterList: this.formGroup.array([])
        });

        res.subscriptionParameterList.forEach( (parameter) => {
          this.subscriptionParameterList.push( this.addFrequency(parameter) );
        });

        this.processing$.next(false);
    }, err => {
        this.processing$.next(false);
    });
  }
  getSubscription(type, uuid): Observable<any> {

    this.subscriptionService.getSubscription(type,uuid).subscribe( (res) => {
      console.log(res);
    });
    return observableOf({
        'id': 60,
        'type': 'content+statistics',
        'subscriptionParameterList': [
            {
                'id': 12,
                'name': 'frequency_c',
                'value': 'D'
            },
            {
                'id': 13,
                'name': 'frequency_s',
                'value': 'M'
            }
        ],
        'subscriptionType': 'content+statistics',
        '_links': {
            'dSpaceObject': {
                'href': 'http://localhost:8080/server/api/core/subscriptions/60/dSpaceObject'
            },
            'ePerson': {
                'href': 'http://localhost:8080/server/api/core/subscriptions/60/ePerson'
            },
            'self': {
                'href': 'http://localhost:8080/server/api/core/subscriptions/60'
            }
        }
    });
  }

  addFrequencies() {
    this.processing$.next(true);
    const type = this.subscriptionForm.get('subscriptionType').value;
    if ( type === 'content' ) {

      let index = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_s';
      });

      if ( index !== -1 ) {
        this.subscriptionParameterList.removeAt(index);
      }

      index = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_c';
      });

      if ( index === -1 ) {
        this.subscriptionParameterList.push(this.newFrequency('frequency_c'));
      }

    } else if ( type === 'statistics' ) {

      let index = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_c';
      });

      if ( index !== -1 ) {
        this.subscriptionParameterList.removeAt(index);
      }

      index = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_s';
      });

      if ( index === -1 ) {
        this.subscriptionParameterList.push(this.newFrequency('frequency_s'));
      }

    } else {

      const index = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_c';
      });

      if ( index === -1 ) {
        this.subscriptionParameterList.insert(0,this.newFrequency('frequency_c'));
      }

      const indexS = this.subscriptionParameterList.controls.findIndex( (control) => {
        return control.value.name === 'frequency_s';
      });

      if ( indexS === -1 ) {
        this.subscriptionParameterList.insert(1,this.newFrequency('frequency_s'));
      }
    }
    this.processing$.next(false);
  }

  newFrequency(name): FormGroup {
    return this.formGroup.group({
              id: null,
              name: name,
              value: null
            });
  }

  addFrequency(obj): FormGroup {
    return this.formGroup.group({
              id: obj.id,
              name: obj.name,
              value: obj.value
            });
  }

  get subscriptionParameterList(): FormArray {
    return this.subscriptionForm.get('subscriptionParameterList') as FormArray;
  }

  changed(event) {
    this.addFrequencies();
  }

  submit() {
    if (this.subscriptionForm.valid) {
      if (this.subscriptionForm.value.id) {
        this.updateForm(this.subscriptionForm.value);
      } else {
        this.createForm(this.subscriptionForm.value);
      }
    }
  }

  updateForm(body) {

    // this.notificationsService.notificationWithAnchor(NotificationType.Success,null,'/subscription','subscription','Go to Subscription statistics',null);
    this.subscriptionService.updateSubscription(body,this.eperson,this.injectedContextMenuObject.uuid).subscribe( (res) => {
      console.log(res);
      this.notify();
    });
  }

  createForm(body) {
    this.subscriptionService.createSubscription(body,this.eperson,this.injectedContextMenuObject.uuid).subscribe( (res) => {
      console.log(res);
      this.notify();
    });
  }

  notify() {
    const options = new NotificationOptions();
    options.timeOut = 0;
    const link = '/subscriptions';
    this.notificationsService.notificationWithAnchor(
      NotificationType.Success,
      options,
      link,
      'context-menu.actions.subscription.notification.here-text',
      'context-menu.actions.subscription.notification.content',
      'here');
  }

}
