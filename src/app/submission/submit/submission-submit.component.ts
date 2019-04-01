import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { Collection } from '../../core/shared/collection.model';

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
   * @param {SubmissionService} submissioService
   * @param {Router} router
   * @param {TranslateService} translate
   * @param {ViewContainerRef} viewContainerRef
   */
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private router: Router,
              private submissioService: SubmissionService,
              private translate: TranslateService,
              private viewContainerRef: ViewContainerRef) {
  }

  /**
   * Create workspaceitem on the server and initialize all instance variables
   */
  ngOnInit() {
    // NOTE execute the code on the browser side only, otherwise it is executed twice
    this.subs.push(
      this.submissioService.createSubmission()
        .subscribe((submissionObject: SubmissionObject) => {
          // NOTE new submission is created on the browser side only
          if (isNotNull(submissionObject)) {
            if (isEmpty(submissionObject)) {
              this.notificationsService.info(null, this.translate.get('submission.general.cannot_submit'));
              this.router.navigate(['/mydspace']);
            } else {
              this.collectionId = (submissionObject.collection as Collection).id;
              this.selfUrl = submissionObject.self;
              this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
              this.submissionId = submissionObject.id;
              this.changeDetectorRef.detectChanges();
            }
          }
        })
    )
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
