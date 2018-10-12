import { Inject, OnInit } from '@angular/core';
import { SectionDataObject } from './section-data.model';
import { Observable } from 'rxjs/Observable';
import { SectionsService } from '../sections.service';
import { isNotUndefined } from '../../../shared/empty.util';

export interface SectionDataModel {
  sectionData: SectionDataObject
}

/**
 * An abstract model class for a submission edit form section.
 */
export abstract class SectionModelComponent implements OnInit, SectionDataModel {
  protected abstract sectionService: SectionsService;
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

  ngOnInit(): void {
    this.onSectionInit();
    this.updateSectionStatus();
  }

  protected abstract getSectionStatus(): Observable<boolean>;
  protected abstract onSectionInit(): void;

  protected updateSectionStatus(): void {
    this.getSectionStatus()
      .filter((sectionStatus: boolean) => isNotUndefined(sectionStatus))
      .startWith(true)
      .subscribe((sectionStatus: boolean) => {
        this.sectionService.setSectionStatus(this.submissionId, this.sectionData.id, sectionStatus);
      });
  }
}
