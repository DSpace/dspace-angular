import { Component, Inject } from '@angular/core';
import { SectionModelComponent } from '../models/section.model';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionDataObject } from '../models/section-data.model';

@Component({
  selector: 'ds-submission-section-default',
  styleUrls: ['./section-default.component.scss'],
  templateUrl: './section-default.component.html',
})
export class DefaultSectionComponent extends SectionModelComponent {

  protected operationsBuilder: JsonPatchOperationsBuilder;

  constructor(@Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

}
