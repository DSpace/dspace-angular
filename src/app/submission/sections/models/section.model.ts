import { Inject } from '@angular/core';
import { SectionDataObject } from './section-data.model';

export interface SectionDataModel {
  sectionData: SectionDataObject
}

/**
 * An abstract model class for a submission edit form section.
 */
export abstract class SectionModelComponent implements SectionDataModel {
  collectionId: string;
  sectionData: SectionDataObject;
  submissionId: string;
  protected valid: boolean;

  public constructor(@Inject('collectionIdProvider') public injectedCollectionId: string,
                     @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
                     @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    this.collectionId = injectedCollectionId;
    this.sectionData = injectedSectionData;
    this.submissionId = injectedSubmissionId;
  }
}
