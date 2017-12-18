import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SubmissionRestService } from '../submission-rest.service';
import { NormalizedWorkspaceItem } from '../models/normalized-workspaceitem.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';
import {Chips} from "../../shared/chips/chips.model";

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})

export class SubmissionSubmitComponent implements OnInit {
  public model: any;


  public collectionId: string;
  public submissionDefinition: SubmissionDefinitionsModel;
  public submissionId: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private restService: SubmissionRestService) {
  }

  ngOnInit() {
    this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems: NormalizedWorkspaceItem) => workspaceitems[0])
      .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
        this.collectionId = workspaceitems.collection[0].id;
        this.submissionDefinition = workspaceitems.submissionDefinition[0];
        this.submissionId = workspaceitems.id;
        this.changeDetectorRef.detectChanges();
    });
  }

}
