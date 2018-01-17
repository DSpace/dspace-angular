import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { SubmissionRestService } from '../submission-rest.service';
import { NormalizedWorkspaceItem } from '../models/normalized-workspaceitem.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})

export class SubmissionSubmitComponent implements OnInit {

  public collectionId: string;
  public model: any;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: any,
              private restService: SubmissionRestService) {
  }

  ngOnInit() {
    if (!isPlatformServer(this.platformId)) {
      // NOTE execute the code on the browser side only, otherwise it is executed twice
      this.restService.postToEndpoint('workspaceitems', {})
        .map((workspaceitems) => workspaceitems[0])
        .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
          this.collectionId = workspaceitems.collection[0].id;
          this.submissionDefinition = workspaceitems.submissionDefinition[0];
          this.submissionId = workspaceitems.id;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

}
