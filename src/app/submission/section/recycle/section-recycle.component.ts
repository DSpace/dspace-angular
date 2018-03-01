import { SectionType } from '../section-type';
import { Component, Inject, OnChanges } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { renderSectionFor } from '../section-decorator';
import { SectionDataObject } from '../section-data.model';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { WorkspaceitemSectionDataType } from '../../../core/submission/models/workspaceitem-sections.model';
import { ConfigData } from '../../../core/config/config-data';
import { SubmissionFormsModel } from '../../../core/shared/config/config-submission-forms.model';
import { isUndefined } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionState } from '../../submission.reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ds-trash-section',
  styleUrls: ['./section-trash.component.scss'],
  templateUrl: './section-trash.component.html',
})
@renderSectionFor(SectionType.Upload)
export class TrashSectionComponent extends SectionModelComponent {
  public isLoading = true;

  constructor(
    protected store: Store<SubmissionState>,
    @Inject('collectionIdProvider') public injectedCollectionId: string,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {

        this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
          .take(1)
          .subscribe((sectionData: WorkspaceitemSectionDataType) => {

              this.sectionData.errors = [];
              this.init(sectionData);
              this.isLoading = false;
          });
  }

  init(sectionData: WorkspaceitemSectionDataType) {

  }
}
