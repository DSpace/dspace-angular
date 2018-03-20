import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { SubmissionRestService } from '../submission-rest.service';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { hasValue, isEmpty, isNotUndefined } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { SubmissionService } from '../submission.service';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from '../../shared/services/platform.service';

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
              private platform: PlatformService,
              private restService: SubmissionRestService,
              private route: ActivatedRoute,
              private router: Router,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    if (this.platform.isBrowser) {
      // NOTE execute the code on the browser side only, otherwise it is executed twice
      this.subs.push(this.route.paramMap
        .subscribe((params: ParamMap) => {
          this.submissionId = params.get('id');
          this.subs.push(
            this.restService.getDataById(this.submissionService.getSubmissionObjectLinkName(), this.submissionId)
              .filter((submissionObjects: Workspaceitem[] | Workflowitem[]) => isNotUndefined(submissionObjects))
              .take(1)
              .map((submissionObjects: Workspaceitem[] | Workflowitem[]) => submissionObjects[0])
              .subscribe((submissionObject: Workspaceitem | Workflowitem) => {
                if (isEmpty(submissionObject)) {
                  this.notificationsService.info(null, this.translate.get('submission.general.cannot_submit'));
                  this.router.navigate(['/mydspace']);
                } else {
                  this.collectionId = submissionObject.collection[0].id;
                  this.selfUrl = submissionObject.self;
                  this.sections = submissionObject.sections;
                  this.submissionDefinition = submissionObject.submissionDefinition[0];
                  this.changeDetectorRef.detectChanges();
                }
              })
          )
        }));
    }
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
