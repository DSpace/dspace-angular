import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl,FormArray, FormBuilder } from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../../subscriptions/subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationType } from '../../../notifications/models/notification-type';
import { NotificationOptions } from '../../../notifications/models/notification-options.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent implements OnInit {


  @Input("dso") dso : DSpaceObject;
  @Input("eperson") eperson : string;
  @Input("subscription") subscription! : Subscription;

  @Output('close') close : EventEmitter<string> = new EventEmitter<string>();

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  subscriptionForm: FormGroup;


  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  types = [
    {name: 'Content' ,value: 'content'},
    {name: 'Statistics' ,value: 'statistics'},
    {name: 'Content & Statistics' ,value: 'content+statistics'},
  ];

  constructor(private formGroup: FormBuilder,
    private notificationsService: NotificationsService,
    private subscriptionService: SubscriptionService) { }

  ngOnInit(): void {
    if(!!this.subscription){
      this.buildFormBuilder(this.subscription);
    }else{
      this.initSubscription();
    }
  }


  initSubscription() {
    this.processing$.next(true);
    this.getSubscription(this.eperson, this.dso.uuid).subscribe( (res) => {
      this.buildFormBuilder(res);
      this.processing$.next(false);
    }, err => {
        this.processing$.next(false);
    });
  }

  buildFormBuilder(subscription){
    this.subscriptionForm = this.formGroup.group({
      id: subscription.id,
      subscriptionType: subscription.subscriptionType,
      subscriptionParameterList: this.formGroup.array([])
    });

    subscription.subscriptionParameterList.forEach( (parameter) => {
      this.subscriptionParameterList.push( this.addFrequency(parameter) );
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
    this.subscriptionService.updateSubscription(body,this.eperson,this.dso.uuid).subscribe( (res) => {
      console.log(res);
      this.notify();
    });
  }

  createForm(body) {
    this.subscriptionService.createSubscription(body,this.eperson,this.dso.uuid).subscribe( (res) => {
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

  c(text){
    this.close.emit(text);
  }

}
