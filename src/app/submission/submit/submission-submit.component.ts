import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { Collection } from '../../core/shared/collection.model';

@Component({
  selector: 'ds-submit-page',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})
export class SubmissionSubmitComponent implements OnDestroy, OnInit {

  public collectionId: string;
  public model: any;
  public selfUrl: string;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  protected subs: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private router: Router,
              private submissioService: SubmissionService,
              private translate: TranslateService,
              private viewContainerRef: ViewContainerRef) {
  }

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

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());

    this.viewContainerRef.clear();
    this.changeDetectorRef.markForCheck();
  }

}
