import { SectionType } from '../section-type';
import { Component, Inject } from '@angular/core';
import { SectionModelComponent } from '../section.model';
import { renderSectionFor } from '../section-decorator';
import { SectionDataObject } from '../section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { Store } from '@ngrx/store';
import { WorkspaceitemSectionRecycleObject } from '../../../core/submission/models/workspaceitem-section-recycle.model';
import { submissionSectionDataFromIdSelector } from '../../selectors';
import { isNotEmpty } from '../../../shared/empty.util';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-recycle-section',
  styleUrls: ['./section-recycle.component.scss'],
  templateUrl: './section-recycle.component.html',
})

@renderSectionFor(SectionType.Recycle)
export class RecycleSectionComponent extends SectionModelComponent {
  public sectionDataObs: Observable<any>;
  public isLoading = true;

  public unexpected: any[]; // FormFieldChangedObject[];
  public metadata: any[]; // FormFieldMetadataValueObject[];
  public files: any[]; // WorkspaceitemSectionUploadFileObject[];

  constructor(protected store: Store<SubmissionState>,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {

    this.sectionDataObs = this.store.select(submissionSectionDataFromIdSelector(this.submissionId, this.sectionData.id))
      .filter((sd) => isNotEmpty(sd))
      // .startWith( {metadata:[]})
      .distinctUntilChanged()
      .map( (sd) => {
        console.log('sectionData for recycle...');
        console.log(sd);
        console.log('sectionData for recycle end');
        return sd;
      });

    this.unexpected = this.sectionData.unexpected;
    this.metadata = this.sectionData.metadata;
    this.files = this.sectionData.files;

    this.isLoading = false;
  }

}
