import { Component, Inject } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { RoleType } from '../../../core/roles/role-types';
import {
  OperationType,
  WorkspaceitemSectionCorrectionBitstreamObject,
  WorkspaceitemSectionCorrectionMetadataObject,
  WorkspaceitemSectionCorrectionObject
} from '../../../core/submission/models/workspaceitem-section-correction.model';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-correction',
  templateUrl: './section-correction.component.html'
})
@renderSectionFor(SectionsType.Correction)
export class SubmissionSectionCorrectionComponent extends SectionModelComponent {

  /**
   * Contain the correction information regarding item's bitstream
   */
  public correctionBitstreamData$: BehaviorSubject<WorkspaceitemSectionCorrectionBitstreamObject[]> = new BehaviorSubject<WorkspaceitemSectionCorrectionBitstreamObject[]>([]);

  /**
   * Contain the correction information regarding item's metadata
   */
  public correctionMetadataData$: BehaviorSubject<WorkspaceitemSectionCorrectionMetadataObject[]> = new BehaviorSubject<WorkspaceitemSectionCorrectionMetadataObject[]>([]);

  public roleTypeEnum = RoleType;
  public operationType = OperationType;

  /**
   * The list of Subscription
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  constructor(protected sectionService: SectionsService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  protected getSectionStatus(): Observable<boolean> {
    return observableOf(true);
  }

  /**
   * Retrieve correction metadata list
   */
  getItemData(sectionData: WorkspaceitemSectionCorrectionObject): WorkspaceitemSectionCorrectionMetadataObject[] {
    return sectionData?.metadata || [];
  }

  /**
   * Retrieve correction bitstream list
   */
  getFileData(sectionData: WorkspaceitemSectionCorrectionObject): WorkspaceitemSectionCorrectionBitstreamObject[] {
    const correctionObjectBitstreams: WorkspaceitemSectionCorrectionBitstreamObject[] = sectionData?.bitstream || [];
    return [...correctionObjectBitstreams].sort((obj1: WorkspaceitemSectionCorrectionBitstreamObject, obj2: WorkspaceitemSectionCorrectionBitstreamObject) => {
        return obj1.filename > obj2.filename ? 1 : -1;
      }
    );
  }

  getFileOperationLabel(operation: OperationType): string {
    let label = '';
    switch (operation) {
      case OperationType.ADD:
        label = 'submission.sections.correction.bitstream.operation.add';
        break;
      case OperationType.REMOVE:
        label = 'submission.sections.correction.bitstream.operation.remove';
        break;
      case OperationType.MODIFY:
        label = 'submission.sections.correction.bitstream.operation.modify';
        break;
    }

    return label;
  }

  sortMetadataByLabel(metadata: WorkspaceitemSectionCorrectionMetadataObject[]): WorkspaceitemSectionCorrectionMetadataObject[] {
    return metadata.sort((obj1: WorkspaceitemSectionCorrectionMetadataObject, obj2: WorkspaceitemSectionCorrectionMetadataObject) => {
      return obj1.label > obj2.label ? 1 : -1;
    });
  }

  showTable(): boolean {
    return Object.values(this.sectionData.data).length > 0;
  }

  protected onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  protected onSectionInit(): void {
    this.subs.push(
      this.sectionService.getSectionData(this.submissionId, this.sectionData.id, this.sectionData.sectionType).pipe(
        filter((data: WorkspaceitemSectionCorrectionObject) => isNotEmpty(data))
      ).subscribe((data: WorkspaceitemSectionCorrectionObject) => {
        this.correctionMetadataData$.next(this.getItemData(data));
        this.correctionBitstreamData$.next(this.getFileData(data));
      })
    );
  }

}
