import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { hasValue, isEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/config/models/config-submission-definitions.model';
import { SubmissionService } from '../submission.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { Collection } from '../../core/shared/collection.model';
import { flatMap, tap } from 'rxjs/operators';

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
      tap((params: ParamMap) => this.submissionId = params.get('id')),
      flatMap((params: ParamMap) => this.submissionService.retrieveSubmission(params.get('id')))
    ).subscribe((submissionObject: SubmissionObject) => {
      // NOTE new submission is retrieved on the browser side only
      if (isNotNull(submissionObject)) {
        if (isEmpty(submissionObject)) {
          this.notificationsService.info(null, this.translate.get('submission.general.cannot_submit'));
          this.router.navigate(['/mydspace']);
        } else {
          this.collectionId = (submissionObject.collection as Collection).id;
          this.selfUrl = submissionObject.self;
          this.sections = submissionObject.sections;
          this.submissionDefinition = (submissionObject.submissionDefinition as SubmissionDefinitionsModel);
          this.changeDetectorRef.detectChanges();
        }
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
