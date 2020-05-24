import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {forkJoin, of, Subscription} from 'rxjs';

import {hasValue, isEmpty, isNotEmpty, isNotNull} from '../../shared/empty.util';
import {SubmissionDefinitionsModel} from '../../core/config/models/config-submission-definitions.model';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {SubmissionService} from '../submission.service';
import {SubmissionObject} from '../../core/submission/models/submission-object.model';
import {Collection} from '../../core/shared/collection.model';
import {CollectionDataService} from '../../core/data/collection-data.service';
import {find, flatMap, map} from 'rxjs/operators';
import {RemoteData} from '../../core/data/remote-data';
import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';

/**
 * This component allows to submit a new workspaceitem.
 */
@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})
export class SubmissionSubmitComponent implements OnDestroy, OnInit {

  /**
   * The collection id this submission belonging to
   * @type {string}
   */
  public collectionId: string;

  /**
   * The collection id input to create a new submission
   * @type {string}
   */
  public collectionParam: string;

  /**
   * The entity type input to create a new submission
   * @type {string}
   */
  private entityTypeParam: string;
  private collectionRelationshipType: string;
  /**
   * The submission self url
   * @type {string}
   */
  public selfUrl: string;

  /**
   * The configuration object that define this submission
   * @type {SubmissionDefinitionsModel}
   */
  public submissionDefinition: SubmissionDefinitionsModel;

  /**
   * The submission id
   * @type {string}
   */
  public submissionId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {NotificationsService} notificationsService
   * @param {SubmissionService} submissionService
   * @param {Router} router
   * @param {TranslateService} translate
   * @param {ViewContainerRef} viewContainerRef
   * @param {ActivatedRoute} route
   */
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private collectionDataService: CollectionDataService,
              private router: Router,
              private submissionService: SubmissionService,
              private translate: TranslateService,
              private viewContainerRef: ViewContainerRef,
              private route: ActivatedRoute) {

    this.collectionParam = this.route.snapshot.queryParams.collection;
    this.entityTypeParam = this.route.snapshot.queryParams.entityType;
  }

  /**
   * Create workspaceitem on the server and initialize all instance variables
   */
  ngOnInit() {
    const collObservable = of('')
      .pipe(
        flatMap((collectionParam: string) => {
          if (!this.collectionParam) {
            return of(undefined);
          }
          return this.collectionDataService.findById(this.collectionParam)
        }),
        find((collectionRD: RemoteData<Collection>) => {
          if (collectionRD === undefined) {
            return true;
          }
          return isNotEmpty(collectionRD.payload)
        }),
        map((respData: RemoteData<Collection>) => {
          if (respData &&
            respData.payload &&
            respData.payload.metadata &&
            respData.payload.metadata['relationship.type']) {
            return respData.payload.metadata['relationship.type'][0].value;
          }
          return undefined;
        })
      );

    const sub$ = forkJoin([collObservable, of(this.entityTypeParam)]).pipe(
      flatMap((values: string[]) => {
        const collType = values[0];
        const paramType = values[1];

        if (!collType && !paramType) {  // no params provided
          return observableThrowError(new Error('No entity type detected'));
        }
        if (collType && !paramType) { // only collection param provided
          return of(collType);
        }
        if (!collType && paramType) { // only entityType param provided
          return of(paramType);
        }
        if (collType === paramType) { // both are provided
          return of(collType);
        }
        // both are provided but are not equal
        return observableThrowError(new Error('Collection\'s relationship type ' +
          'does not match with input entity type'));

      }),
      flatMap((entityType: string) => this.submissionService.createSubmission(entityType, this.collectionParam))
    ).subscribe((submissionObject: SubmissionObject) => {
        // NOTE new submission is created on the browser side only
        if (isNotNull(submissionObject)) {
          if (isEmpty(submissionObject)) {
            this.notificationsService.info(null, this.translate.get('submission.general.cannot_submit'));
            this.router.navigate(['/mydspace']);
          } else {
            this.collectionId = (submissionObject.collection as Collection).id;
            this.selfUrl = submissionObject._links.self.href;
            this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
            this.submissionId = submissionObject.id;
            this.changeDetectorRef.detectChanges();
          }
        }
      },
      (err) => {
        this.notificationsService.info(null, this.translate.get('submission.general.bad_query_params'));
        this.router.navigate(['/mydspace']);
      }
    );

    this.subs.push(sub$);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());

    this.viewContainerRef.clear();
    this.changeDetectorRef.markForCheck();
  }

}
