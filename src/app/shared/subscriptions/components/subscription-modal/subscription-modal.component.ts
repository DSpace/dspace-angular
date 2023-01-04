import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable } from 'rxjs';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationType } from '../../../notifications/models/notification-type';
import { NotificationOptions } from '../../../notifications/models/notification-options.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../../../core/data/paginated-list.model';

import { hasValue } from '../../../empty.util';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';

import { filter, switchMap, take } from 'rxjs/operators';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../core/shared/operators';

@Component({
  selector: 'ds-subscription-modal',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.scss']
})
export class SubscriptionModalComponent implements OnInit {

  /**
   * DSpaceObject of which to get the subscriptions
   */
  @Input() dso: DSpaceObject;

  /**
   * EPerson of which to get the subscriptions
   */
  @Input() epersonId: string;


  /**
   * Close event emit to close modal
   */
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  /**
   * List of subscription for the dso object and eperson relation
   */
  subscriptions: Subscription[];

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
   * Types of subscription to be shown on select
   */
  types = [
    { name: 'Content', value: 'content' },
    { name: 'Statistics', value: 'statistics' },
  ];

  /**
   * Frequencies to be shown as checkboxes
   */
  frequencies = [
    { name: 'daily', value: 'D' },
    { name: 'monthly', value: 'M' },
    { name: 'weekly', value: 'W' },
  ];

  constructor(private formGroup: FormBuilder,
              private modalService: NgbModal,
              private notificationsService: NotificationsService,
              private subscriptionService: SubscriptionService
  ) {
  }

  /**
   * Function to get subscriptionParameterList form array cleaner
   */
  get subscriptionParameterList(): FormArray {
    return this.subscriptionForm.get('subscriptionParameterList') as FormArray;
  }

  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {
    this.initSubscription();
  }

  /**
   * Get subscription for the eperson & dso object relation
   * If no subscription start with an empty form
   */
  initSubscription(): void {
    this.subscriptions = [];
    this.processing$.next(true);
    this.getSubscription(this.epersonId, this.dso?.uuid).subscribe((subscriptionsRes: PaginatedList<Subscription>) => {

      if (subscriptionsRes.pageInfo.totalElements > 0) {
        this.subscriptions = subscriptionsRes.page;
      } else {
        this.initEmptyForm('content');
      }

      this.processing$.next(false);
    }, err => {
      this.processing$.next(false);
    });
  }

  /**
   * Function to get subscriptions based on the eperson & dso
   *
   * @param epersonId Eperson that is logged in
   * @param uuid DSpaceObject id that subscriptions are related to
   */
  getSubscription(epersonId: string, uuid: string): Observable<PaginatedList<Subscription>> {
    return this.subscriptionService.getSubscriptionByPersonDSO(epersonId, uuid).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Starts a new empty form
   *
   * @param subscriptionType type of subscription to start the form
   */
  initEmptyForm(subscriptionType): void {
    this.subscriptionForm = this.formGroup.group({
      type: subscriptionType,
      subscriptionParameterList: this.formGroup.array([], Validators.required)
    });
  }

  /**
   * When add button is clicked, if there is no subscription being added it will add a new form
   */
  addNewSubscription(): void {
    if (!this.subscriptionForm) {
      this.initEmptyForm('content');
    }
  }

  /**
   * Starts a form with information filled by the subscription
   *
   * @param subscription subscription to start the form
   */
  editForm(subscription): void {
    this.subscriptionForm = this.formGroup.group({
      id: subscription.id,
      type: subscription.subscriptionType,
      subscriptionParameterList: this.formGroup.array([], Validators.required)
    });

    subscription.subscriptionParameterList.forEach((parameter) => {
      this.addFrequency(parameter.value);
    });
  }


  /**
   * When add button is clicked, if there is no subscription being added it will add a new form
   */
  editSubscription(subscription: Subscription): void {
    if (!this.subscriptionForm) {
      this.editForm(subscription);
    }
  }

  /**
   * When frequency checkboxes are being changed we add/remove frequencies from subscriptionParameterList
   */
  selectCheckbox(event, frequency): void {
    if (event.target.checked) {
      this.addFrequency(frequency);
    } else {
      this.removeFrequency(frequency);
    }
  }

  /**
   * When subscription type select box is changed set new value of type
   *
   * @param event Event of changing selectbox
   */
  changed(event): void {
    this.subscriptionForm.patchValue({ 'type': event.target.value });
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
   * When user saves it will check if form is valid and send request to create or update a subscription
   */
  submit(): void {
    this.processing$.next(true);
    this.submitted = true;
    if (this.subscriptionForm.valid) {
      if (this.subscriptionForm.value.id) {
        this.updateForm(this.subscriptionForm.value);
      } else {
        this.createForm(this.subscriptionForm.value);
      }
    }
  }

  /**
   * Sends request to create a new subscription, refreshes the table of subscriptions and notifies about summary page
   */
  createForm(body): void {
    this.subscriptionService.createSubscription(body, this.epersonId, this.dso.uuid).subscribe((res) => {
        this.refresh();
        this.notify();
        this.processing$.next(false);
      },
      err => {
        this.processing$.next(false);
      }
    );
  }

  /**
   * Sends request to update a subscription, refreshes the table of subscriptions and notifies about summary page
   */
  updateForm(body) {
    this.subscriptionService.updateSubscription(body, this.epersonId, this.dso.uuid).subscribe((res) => {
        this.refresh();
        this.notify();
        this.processing$.next(false);
      },
      err => {
        this.processing$.next(false);
      }
    );
  }


  /**
   * Sends the request to delete the subscription with a specific id
   */
  deleteSubscription(id): Observable<NoContent> {
    return this.subscriptionService.deleteSubscription(id);
  }

  /**
   * Creates a notification with the link to the subscription summary page
   */
  notify(): void {
    const options = new NotificationOptions();
    options.timeOut = 0;
    const link = '/subscriptions';
    this.notificationsService.notificationWithAnchor(
      NotificationType.Success,
      options,
      link,
      'context-menu.actions.subscription.notification.here-text',
      'context-menu.actions.subscription.notification.content',
      'here'
    );
  }

  /**
   * When an action is done it will reinitialize the table and remove subscription form
   */
  refresh(): void {
    this.initSubscription();
    this.subscriptionForm = null;
    this.submitted = false;
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

  /**
   * Deletes Subscription, show notification on success/failure & updates list
   *
   * @param subscription Subscription to be deleted
   */
  deleteSubscriptionPopup(subscription: Subscription): void {
    if (hasValue(subscription.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = this.dso;
      modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-subscription.header';
      modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-subscription.info';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-subscription.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-subscription.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';

      modalRef.componentInstance.response.pipe(
        take(1),
        filter((confirm: boolean) => confirm),
        switchMap(() => this.deleteSubscription(subscription.id))
      ).subscribe(() => {
        this.refresh();
      });

    }
  }
}
