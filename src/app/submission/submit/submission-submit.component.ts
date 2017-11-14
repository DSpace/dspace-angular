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
  public collectionId = '1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb';
  public submissionId: string;

  constructor(private store:Store<SubmissionState>,
              private restService: SubmissionRestService,
              private cds: CollectionDataService) {}

  ngOnInit() {
    this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems: NormalizedWorkspaceItem) => workspaceitems[0])
      .subscribe((workspaceitems: NormalizedWorkspaceItem) => {
        console.log('d', workspaceitems)
        this.collectionId = workspaceitems.collection[0].id;
        this.submissionId = workspaceitems.id;
    });
    // this.cds.findById('5ad50035-ca22-4a4d-84ca-d5132f34f588')
    // this.cds.findByHref('https://dspace7.dev01.4science.it/dspace-spring-rest/api/core/collections/5ad50035-ca22-4a4d-84ca-d5132f34f588/license')
    /*this.cds.findByHref('https://dspace7.dev01.4science.it/dspace-spring-rest/api/core/collections/5ad50035-ca22-4a4d-84ca-d5132f34f588/defaultBitstreamsPolicies')
      .subscribe((c) => console.log('c', c))*/
  }
}
