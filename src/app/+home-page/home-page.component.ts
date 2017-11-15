import { Component } from '@angular/core';
import { isNotUndefined } from '../shared/empty.util';
import { CollectionDataService } from '../core/data/collection-data.service';
import { NormalizedCollection } from '../core/cache/models/normalized-collection.model';
import { RemoteData } from '../core/data/remote-data';
import { Collection } from '../core/shared/collection.model';
import { SubmissionSectionsConfigService } from '../core/config/submission-sections-config.service';
import { SubmissionRestService } from '../submission/submission-rest.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {

  constructor(private collectionDataService: CollectionDataService, private service: SubmissionRestService) { }
  ngOnInit() {
    /*this.collectionDataService.findById('1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb')
    // this.collectionDataService.findByHref('https://dspace7.dev01.4science.it/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultAccessConditions')
      .filter((collectionData) => isNotUndefined((collectionData.payload)))
      .take(1)
      /*.flatMap((collectionData: RemoteData<Collection>) => this.collectionDataService.findByHref(collectionData.payload._links.defaultBitstreamsPolicies))
      .filter((collectionData) => isNotUndefined((collectionData.payload)))
      .take(1)
      .subscribe((collectionData) => {
        console.log(collectionData);

      })*/
  }
}
