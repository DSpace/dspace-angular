import { Component, OnInit } from '@angular/core';
import { SubmissionRestService } from '../submission-rest.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { NormalizedWorkspaceItem } from '../models/normalized-workspaceitem.model';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { WorkspaceitemSectionsObject } from '../models/workspaceitem-sections.model';

@Component({
  selector: 'ds-submission-edit',
  styleUrls: ['./submission-edit.component.scss'],
  templateUrl: './submission-edit.component.html'
})

export class SubmissionEditComponent implements OnInit {
  public collectionId: string;
  public sections: WorkspaceitemSectionsObject;
  public submissionId = '1202';

  constructor(private store:Store<SubmissionState>,
              private restService: SubmissionRestService,
              private cds: CollectionDataService) {}

  ngOnInit() {
    this.restService.getDataById(this.submissionId)
      .map((workspaceitems: NormalizedWorkspaceItem) => workspaceitems[0])
      .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
        this.collectionId = workspaceitems.collection[0].id;
        this.sections = workspaceitems.sections;
    });
  }
}
