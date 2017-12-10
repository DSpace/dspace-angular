import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubmissionRestService } from '../submission-rest.service';
import { NormalizedWorkspaceItem } from '../models/normalized-workspaceitem.model';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { WorkspaceitemSectionsObject } from '../models/workspaceitem-sections.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotUndefined } from '../../shared/empty.util';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { WorkspaceitemObject } from '../models/workspaceitem.model';

@Component({
  selector: 'ds-submission-edit',
  styleUrls: ['./submission-edit.component.scss'],
  templateUrl: './submission-edit.component.html'
})

export class SubmissionEditComponent implements OnDestroy, OnInit {
  public collectionId: string;
  public sections: WorkspaceitemSectionsObject;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private restService: SubmissionRestService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.subs.push(this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.submissionId = params.get('id');
        this.restService.getDataById(this.submissionId)
          .filter((workspaceitems: WorkspaceitemObject) => isNotUndefined(workspaceitems))
          .take(1)
          .map((workspaceitems: WorkspaceitemObject) => workspaceitems[0])
          .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
            this.collectionId = workspaceitems.collection[0].id;
            this.sections = workspaceitems.sections;
            this.submissionDefinition = workspaceitems.submissionDefinition[0];
            this.changeDetectorRef.detectChanges();
          });
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
