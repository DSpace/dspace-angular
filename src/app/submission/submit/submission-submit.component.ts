import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { SubmissionRestService } from '../submission-rest.service';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})

export class SubmissionSubmitComponent implements OnDestroy, OnInit {

  public collectionId: string;
  public model: any;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  protected subs: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: any,
              private restService: SubmissionRestService) {
  }

  ngOnInit() {
    if (!isPlatformServer(this.platformId)) {
      // NOTE execute the code on the browser side only, otherwise it is executed twice
      this.subs.push(
        this.restService.postToEndpoint('workspaceitems', {})
          .map((workspaceitems) => workspaceitems[0])
          .subscribe((workspaceitems: Workspaceitem) => {
            this.collectionId = workspaceitems.collection[0].id;
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
