import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl,FormArray, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../../subscriptions/subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationType } from '../../../notifications/models/notification-type';
import { NotificationOptions } from '../../../notifications/models/notification-options.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';

@Component({
  selector: 'ds-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent implements OnInit {

  @Input("dso") dso : DSpaceObject;
  @Input("eperson") eperson : string;
  @Input("subscriptions") subscriptions! : Subscription[];

  @Output('close') close : EventEmitter<string> = new EventEmitter<string>();

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  subscriptionForm: FormArray = this.formGroup.array([]);

  submitted = false;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  types = [
    {name: 'Content' ,value: 'content'},
    {name: 'Statistics' ,value: 'statistics'},
    {name: 'Content & Statistics' ,value: 'content+statistics'},
  ];

  selectedType;

  frequencies = [
    {name: 'daily' ,value: 'D'},
    {name: 'monthly' ,value: 'M'},
    {name: 'weekly' ,value: 'W'},
  ];

  constructor(private formGroup: FormBuilder,
    private notificationsService: NotificationsService,
    private subscriptionService: SubscriptionService
    ) { }

  ngOnInit(): void {
    if(!!this.subscriptions){
      this.subscriptions.forEach((subscription)=>{
        this.buildFormBuilder(subscription);
      });
    }else{
      this.initSubscription();
    }
  }


  initSubscription() {
    this.processing$.next(true);
    this.getSubscription(this.eperson, this.dso.uuid).subscribe( (subscriptions: PaginatedList<Subscription>) => {
      console.log(subscriptions);
      if(subscriptions.pageInfo.totalElements > 0){
        this.subscriptions = subscriptions.page;

        if(this.subscriptions.length >= 2){
          this.selectedType = 'content+statistics';
        }else{
          this.selectedType = this.subscriptions[0].subscriptionType;
        }

        subscriptions.page.forEach((subscription)=>{
          this.buildFormBuilder(subscription);
        });
      }else{
        this.initEmptyForm("content");
      }

      this.processing$.next(false);
    }, err => {
        this.processing$.next(false);
    });
  }

  initEmptyForm(subscriptionType){
    this.subscriptionForm.push(
      this.formGroup.group({
        // id:null,
        type: subscriptionType,
        // subscriptionType: subscriptionType,
        subscriptionParameterList: this.formGroup.array([], Validators.required)
      })
    );
  }


  selectCheckbox(event,i,frequency){
    if(event.target.checked){
      this.addFrequency(i,frequency)
    }else{
      this.removeFrequency(i,frequency)
    }
  }

  buildFormBuilder(subscription){
    const index = this.subscriptionForm.controls.length;

    this.subscriptionForm.push(
      this.formGroup.group({
        id: subscription.id,
        type: subscription.subscriptionType,
        subscriptionParameterList: this.formGroup.array([], Validators.required)
      })
    );

    subscription.subscriptionParameterList.forEach( (parameter) => {
      this.addFrequency(index,parameter.value,parameter.id);
    });
  }

  getSubscription(epersonId, uuid): Observable<any> {

    return this.subscriptionService.getSubscriptionByPersonDSO(epersonId,uuid);
  }

  newFrequency(name): FormGroup {
    return this.formGroup.group({
              // id: null,
              name: name,
              value: this.formGroup.array([])
            });
  }

  addFrequency(i,frequency,id?) {
    let subscriptionParameterList = this.subscriptionForm.controls[i].get('subscriptionParameterList') as FormArray;

    subscriptionParameterList.push( 
      this.formGroup.group({
          // id: id,
          name: "frequency",
          value: frequency
        })
      );
  }

  removeFrequency(i,frequency) {
    let subscriptionParameterList = this.subscriptionForm.controls[i].get('subscriptionParameterList') as FormArray;
    let index = subscriptionParameterList.controls.findIndex(el => el.value.value == frequency);
    
    subscriptionParameterList.removeAt(index);
  }

  typeChanged(event) {
    if(event.target.value == 'content' || event.target.value == 'statistics'){

      if(this.subscriptionForm.controls.length >= 2){

        // Remove the other type
        let otherType = 'content';

        if(event.target.value == 'content'){
          otherType = 'statistics';
        }
        const index = this.subscriptionForm.controls.findIndex((control) => {
          return control.get("type").value == otherType;
        });

        if(!!this.subscriptionForm.controls[index].get("id") && !!this.subscriptionForm.controls[index].get("id").value){
          this.deleteSubscription(this.subscriptionForm.controls[index].get("id").value);
        }

        this.subscriptionForm.removeAt(index);

      }else{
        // Just change the type value
        this.subscriptionForm.controls[0].patchValue({'type': event.target.value});
      }

    }else{
      //There should be one subscription, we need to add another of the different type
      const index = this.subscriptionForm.controls.findIndex((control) => {
        return control.get("type").value == "content";
      });

      if(index === -1){
        this.initEmptyForm("content");
      }else{
        this.initEmptyForm("statistics");
      }

    }

    this.selectedType = event.target.value;
  }


  submit() {
    this.submitted = true;
    if (this.subscriptionForm.valid) {
      this.subscriptionForm.controls.forEach((subscription) => {
        if (subscription.value.id) {
          this.updateForm(subscription.value);
        } else {
          this.createForm(subscription.value);
        }
      });
    }
  }

  updateForm(body) {
    this.subscriptionService.updateSubscription(body,this.eperson,this.dso.uuid).subscribe( (res) => {
      this.notify();
    });
  }

  createForm(body) {
    this.subscriptionService.createSubscription(body,this.eperson,this.dso.uuid).subscribe( (res) => {
      this.notify();
    });
  }


  deleteSubscription(id){
    this.subscriptionService.deleteSubscription(id).subscribe((res)=>{
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


  getIsChecked(control,frequency){
    return !!control.get('subscriptionParameterList').value.find(el => el.value == frequency.value);
  }
}
