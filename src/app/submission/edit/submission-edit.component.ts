import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { SubmissionService } from '../submission.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { Collection } from '../../core/shared/collection.model';
import { RemoteData } from '../../core/data/remote-data';

@Component({
  selector: 'ds-submission-edit',
  styleUrls: ['./submission-edit.component.scss'],
  templateUrl: './submission-edit.component.html'
})

export class SubmissionEditComponent implements OnDestroy, OnInit {
  public collectionId: string;
  public sections: WorkspaceitemSectionsObject;
  public selfUrl: string;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              private router: Router,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.subs.push(this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.submissionService.retrieveSubmission(params.get('id'))),
      // NOTE new submission is retrieved on the browser side only, so get null on server side rendering
      filter((submissionObjectRD: RemoteData<SubmissionObject>) => isNotNull(submissionObjectRD))
    ).subscribe((submissionObjectRD: RemoteData<SubmissionObject>) => {
      if (submissionObjectRD.hasSucceeded) {
        if (isEmpty(submissionObjectRD.payload)) {
          this.notificationsService.info(null, this.translate.get('submission.general.cannot_submit'));
          this.router.navigate(['/mydspace']);
        } else {
          this.submissionId = submissionObjectRD.payload.id.toString();
          this.collectionId = (submissionObjectRD.payload.collection as Collection).id;
          this.selfUrl = submissionObjectRD.payload.self;
          this.sections = submissionObjectRD.payload.sections;
          this.submissionDefinition = (submissionObjectRD.payload.submissionDefinition as SubmissionDefinitionsModel);
          this.changeDetectorRef.detectChanges();
        }
      } else {
        if (submissionObjectRD.error.statusCode === 404) {
          // redirect to not found page
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
        // TODO handle generic error
      }
    }));
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
