import { Component, Input, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from '../../models/subscription.model';

import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

import { SubscriptionService } from '../../subscription.service';
import { NotificationsService } from '../../../notifications/notifications.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../../../core/data/paginated-list.model';

import { map, switchMap, take, tap } from 'rxjs/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
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

  ePersonId: string;

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
      tap((res) => {
        this.ePersonId = res;
      }),
      shareReplay(),
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
            const type = 'content'; // TODO remove
            const subscription = this.subscriptions.find((s) => s.subscriptionType === type);
            // TODO manage multiple subscriptions with same type (there should be only one)
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

    // for (let type of this.subscriptionTypes) {

      const type = 'content'; // TODO remove

      const currentSubscription =  this.subscriptions?.find((s) => s.subscriptionType === type);

      const body = {
        id: currentSubscription?.id,
        type,
        subscriptionParameterList: []
      };

      let someCheckboxSelected = false;

      for (let frequency of this.frequencies) {
        if (this.subscriptionForm.value[frequency]) { // TODO read the value for the type
          someCheckboxSelected = true;
          body.subscriptionParameterList.push(
            {
              name: 'frequency',
              value: frequency,
            }
          );
        }
      }

      if (currentSubscription && someCheckboxSelected) {
        console.log('UPDATE');
        this.subscriptionService.updateSubscription(body, this.ePersonId, this.dso.uuid).subscribe(console.log);
      } else if (currentSubscription && !someCheckboxSelected) {
        console.log('DELETE');
        this.subscriptionService.deleteSubscription(currentSubscription.id).subscribe(console.log);
      } else if (someCheckboxSelected) {
        console.log('CREATE');
        this.subscriptionService.createSubscription(body, this.ePersonId, this.dso.uuid).subscribe(console.log);
      }


    // }

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

}
