import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable } from 'rxjs';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationType } from '../../../notifications/models/notification-type';
import { NotificationOptions } from '../../../notifications/models/notification-options.model';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../../../core/data/paginated-list.model';

import { hasValue } from '../../../empty.util';
import { ConfirmationModalComponent } from '../../../confirmation-modal/confirmation-modal.component';

import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { NoContent } from '../../../../core/shared/NoContent.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { AuthService } from '../../../../core/auth/auth.service';

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

  ePersonId$: Observable<string>;

  /**
   * Types of subscription to be shown on select
   */
  subscriptionTypes = [ 'content', 'statistics' ];

  /**
   * Frequencies to be shown as checkboxes
   */
  frequencies = [ 'D', 'M', 'W' ];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private subscriptionService: SubscriptionService,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
  ) {
  }

  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {

    this.ePersonId$ = this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      map((ePerson) => ePerson.uuid),
    );

    this.subscriptionForm = this.formBuilder.group({});

    for (let f of this.frequencies) {
      this.subscriptionForm.addControl(f, this.formBuilder.control(false));
    }

    // TODO iterate over subscription types

    /*this.subscriptionForm = this.formBuilder.group({});
    for (let t of this.subscriptionTypes) {
      this.subscriptionForm.addControl(t, this.formBuilder.group({}));
      for (let f of this.frequencies) {
        this.subscriptionForm[t].addControl(f, this.formBuilder.control(false));
      }
    }*/


    this.initSubscription();

  }

  /**
   * Get subscription for the eperson & dso object relation
   * If no subscription start with an empty form
   */
  initSubscription(): void {
    this.processing$.next(true);
    this.ePersonId$.pipe(
      tap(console.log),
      switchMap((ePersonId: string) => this.getSubscription(ePersonId, this.dso?.uuid)),
      getFirstSucceededRemoteDataPayload(),
    ).subscribe({
      next: (res: PaginatedList<Subscription>) => {
        if (res.pageInfo.totalElements > 0) {
          this.subscriptions = res.page;

          // TODO loop over subscription types
          // for (let type of this.subscriptionTypes) {
            const type = 'content'; // remove
            const subscription = this.subscriptions.find((s) => s.subscriptionType === type);
            // TODO manage multiple subscriptions with same tipe (there should be only one)
            for (let parameter of subscription.subscriptionParameterList.filter((p) => p.name === 'frequency')) {
              this.subscriptionForm.controls[parameter.value]?.setValue(true);
            }
          // }

        }
        this.processing$.next(false);
      },
      error: err => {
        this.processing$.next(false);
      }
    });
  }

  /**
   * Function to get subscriptions based on the eperson & dso
   *
   * @param ePersonId Eperson that is logged in
   * @param uuid DSpaceObject id that subscriptions are related to
   */
  getSubscription(ePersonId: string, uuid: string): Observable<RemoteData<PaginatedList<Subscription>>> {
    return this.subscriptionService.getSubscriptionByPersonDSO(ePersonId, uuid);
  }



  submit() {

    // TODO

    /*
        - remove subscription if no checkbox is selected
        - add subscription if it does not exist
        - edit subscription if it already exists
     */

    const body = {
      type: 'content',
      subscriptionParameterList: []
    };

    for (let frequency of this.frequencies) {
      if (this.subscriptionForm.value[frequency]) {
        body.subscriptionParameterList.push(
          {
            name: 'frequency',
            value: frequency,
          }
        );
      }
    }

    // this.subscriptionService.createSubscription(body, this.ePersonId, this.dso.uuid).subscribe((res) => {
    //     // this.refresh();
    //     // this.notify();
    //     // this.processing$.next(false);
    //   },
    //   err => {
    //     // this.processing$.next(false);
    //   }
    // );

  }


  /**
   * Sends request to create a new subscription, refreshes the table of subscriptions and notifies about summary page
   */
  /*createForm(body): void {
    this.subscriptionService.createSubscription(body, this.ePersonId, this.dso.uuid).subscribe((res) => {
        this.refresh();
        this.notify();
        this.processing$.next(false);
      },
      err => {
        this.processing$.next(false);
      }
    );
  }*/

  /**
   * Sends request to update a subscription, refreshes the table of subscriptions and notifies about summary page
   */
  /*updateForm(body) {
    this.subscriptionService.updateSubscription(body, this.ePersonId, this.dso.uuid).subscribe((res) => {
        this.refresh();
        this.notify();
        this.processing$.next(false);
      },
      err => {
        this.processing$.next(false);
      }
    );
  }*/


  /**
   * Sends the request to delete the subscription with a specific id
   */
  /*deleteSubscription(id): Observable<NoContent> {
    return this.subscriptionService.deleteSubscription(id);
  }*/

  /**
   * Creates a notification with the link to the subscription summary page
   */
  /*notify(): void {
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
  }*/

  /**
   * When an action is done it will reinitialize the table and remove subscription form
   */
  /*refresh(): void {
    this.initSubscription();
    this.subscriptionForm = null;
    this.submitted = false;
  }*/

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
  /*deleteSubscriptionPopup(subscription: Subscription): void {
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
  }*/
}
