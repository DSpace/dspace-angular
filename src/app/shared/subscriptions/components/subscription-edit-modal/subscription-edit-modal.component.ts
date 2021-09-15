import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject } from 'rxjs';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-subscription-edit-modal',
  templateUrl: './subscription-edit-modal.component.html',
  styleUrls: ['./subscription-edit-modal.component.scss']
})
export class SubscriptionEditModalComponent implements OnInit {


  /**
   * DSpaceObject of the subscription
   */
  @Input() dso: DSpaceObject;

  /**
   * EPerson of the subscription
   */
  @Input() eperson: string;

  /**
   * List of subscription for the dso object and eperson relation
   */
  @Input() subscription!: Subscription;

  /**
   * Close event emit to close modal
   */
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Reload event emit to refresh informations
   */
  @Output() reload: EventEmitter<string> = new EventEmitter<string>();

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reactive form group that will be used to add subscriptions
   */
  subscriptionForm: FormGroup;

  /**
   * Used to show validation errors when user submits
   */
  submitted = false;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;


  /**
   * Frequencies to be shown as checkboxes
   */
  frequencies = [
    {name: 'daily' ,value: 'D'},
    {name: 'monthly' ,value: 'M'},
    {name: 'weekly' ,value: 'W'},
  ];

  constructor(private formGroup: FormBuilder,
    private notificationsService: NotificationsService,
    private subscriptionService: SubscriptionService
  ) {}

  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {
    this.initSubscription();
  }

  /**
   * If the subscription is passed start the form with the information of subscription
   */
  initSubscription(): void {
    if (!!this.subscription) {
      this.buildFormBuilder(this.subscription);
    }
  }

  /**
   * Function to get subscriptionParameterList form array cleaner
   */
  get subscriptionParameterList(): FormArray {
    return this.subscriptionForm.get('subscriptionParameterList') as FormArray;
  }

  /**
   * When frequency checkboxes are being changed we add/remove frequencies from subscriptionParameterList
   */
  selectCheckbox(event,frequency): void {
    if (event.target.checked) {
      this.addFrequency(frequency);
    } else {
      this.removeFrequency(frequency);
    }
  }

  /**
   * Start the form with preinserted informations
   */
  buildFormBuilder(subscription): void {

    this.subscriptionForm = this.formGroup.group({
      id: subscription.id,
      type: subscription.subscriptionType,
      subscriptionParameterList: this.formGroup.array([], Validators.required)
    });

    subscription.subscriptionParameterList.forEach( (parameter) => {
      this.addFrequency(parameter.value);
    });
  }

  /**
   * Add a new frequency to the subscriptionParameterList form array
   */
  addFrequency(frequency): void {
    this.subscriptionParameterList.push(
      this.formGroup.group({
          name: 'frequency',
          value: frequency
      })
    );
  }

  /**
   * Remove frequency from subscriptionParameterList form array
   */
  removeFrequency(frequency): void {
    const index = this.subscriptionParameterList.controls.findIndex(el => el.value.value === frequency);
    this.subscriptionParameterList.removeAt(index);
  }

  /**
   * When user saves it will check if form is valid and send request to update subscription
   */
  submit(): void {
    this.submitted = true;
    if (this.subscriptionForm.valid) {
      if (this.subscriptionForm.value.id) {
        this.updateForm(this.subscriptionForm.value);
      }
    }
  }

  /**
   * Sends request to update a new subscription, refreshes the table of subscriptions and notifies about summary page
   */
  updateForm(body): void {
    this.subscriptionService.updateSubscription(body,this.eperson,this.dso.uuid).subscribe( (res) => {
      this.reload.emit();
      this.close.emit();
    });
  }

  /**
   * When close button is pressed emit function to close modal
   */
  c(text): void {
    this.close.emit(text);
  }

  /**
   * Returns if a specific frequency exists in the subscriptionParameterList
   */
  getIsChecked(frequency): boolean {
    return !!this.subscriptionForm.get('subscriptionParameterList').value.find(el => el.value === frequency.value);
  }
}
