import { Component, OnInit } from '@angular/core';
import { SubmissionRestService } from '../submission-rest.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { NormalizedWorkspaceItem } from '../../core/cache/models/normalized-workspaceitem.model';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';

@Component({
  selector: 'ds-submission-submit',
  styleUrls: ['./submission-submit.component.scss'],
  templateUrl: './submission-submit.component.html'
})

export class SubmissionSubmitComponent implements OnInit {
  public collectionId: string;
  public submissionId: string;

  constructor(private store:Store<SubmissionState>,
              private restService: SubmissionRestService,
              private cds: CollectionDataService) {}

  ngOnInit() {
    this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems: NormalizedWorkspaceItem) => workspaceitems[0])
      .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
        this.collectionId = workspaceitems.collection[0].id;
        this.submissionId = workspaceitems.id;
    });
  }
}
