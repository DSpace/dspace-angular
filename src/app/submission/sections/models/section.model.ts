import { Inject, OnDestroy, OnInit } from '@angular/core';
import { SectionDataObject } from './section-data.model';
import { Observable } from 'rxjs/Observable';
import { SectionsService } from '../sections.service';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { Subscription } from 'rxjs/Subscription';

export interface SectionDataModel {
  sectionData: SectionDataObject
}

/**
 * An abstract model class for a submission edit form section.
 */
export abstract class SectionModelComponent implements OnDestroy, OnInit, SectionDataModel {
  protected abstract sectionService: SectionsService;
  collectionId: string;
  sectionData: SectionDataObject;
  submissionId: string;
  protected valid: boolean;
  private sectionStatusSub: Subscription;

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
  protected abstract onSectionDestroy(): void;

  protected updateSectionStatus(): void {
    this.sectionStatusSub = this.getSectionStatus()
      .filter((sectionStatus: boolean) => isNotUndefined(sectionStatus))
      .startWith(true)
      .subscribe((sectionStatus: boolean) => {
        this.sectionService.setSectionStatus(this.submissionId, this.sectionData.id, sectionStatus);
      });
  }

  ngOnDestroy(): void {
    this.onSectionDestroy();
    if (hasValue(this.sectionStatusSub)) {
      this.sectionStatusSub.unsubscribe();
    }
  }
}
