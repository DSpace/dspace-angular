import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { hasValue } from '../shared/empty.util';
import { SubmissionDefinitionsModel } from '../core/shared/config/config-submission-definitions.model';
import { SubmissionRestService } from '../submission/submission-rest.service';
import { Workspaceitem } from '../core/submission/models/workspaceitem.model';
import { PlatformService } from '../shared/services/platform.service';

@Component({
  selector: 'ds-submit-page',
  styleUrls: ['./submit-page.component.scss'],
  templateUrl: './submit-page.component.html'
})

export class SubmitPageComponent implements OnDestroy, OnInit {

  public collectionId: string;
  public model: any;
  public selfUrl: string;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  protected subs: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private platform: PlatformService,
              private restService: SubmissionRestService) {
  }

  ngOnInit() {
    if (this.platform.isBrowser) {
      // NOTE execute the code on the browser side only, otherwise it is executed twice
      this.subs.push(
        this.restService.postToEndpoint('workspaceitems', {})
          .map((workspaceitems) => workspaceitems[0])
          .subscribe((workspaceitems: Workspaceitem) => {
            this.collectionId = workspaceitems.collection[0].id;
            this.selfUrl = workspaceitems.self;
            this.submissionDefinition = workspaceitems.submissionDefinition[0];
            this.submissionId = workspaceitems.id;
            this.changeDetectorRef.detectChanges();
          })
      )
    }
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
