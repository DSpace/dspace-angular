import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionModelComponent } from '../section.model';
import {hasValue, isNotEmpty, isNotUndefined} from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SubmissionState } from '../../submission.reducers';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { CoreState } from '../../../core/core.reducers';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';

@Component({
  selector: 'ds-submission-section-files',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})
export class FilesSectionComponent extends SectionModelComponent {

  public bitstreamsKeys = [];
  public bitstreamsIndexes = [];
  public bitstreamsList;
  public collectionPolicies = [];
  public collectionName;
  // To be defined somewhere
  public collectionPoliciesMessageType = 2;

  protected subs = [];

  constructor(private bitstreamService: SectionUploadService,
              private collectionDataService: CollectionDataService,
              private groupService: GroupEpersonService,
              private store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.subs.push(
      this.collectionDataService.findById(this.sectionData.collectionId)
        .filter((collectionData) => isNotUndefined((collectionData.payload)))
        .subscribe((collectionData) => {
            console.log(collectionData);
            this.collectionName = collectionData.payload.name;
            // collectionData.payload.defaultAccessConditions
              // .filter((defaultAccessConditions:RemoteData<AccessCondition[]>) => isNotEmpty(defaultAccessConditions))
            //  .subscribe((payload) => {
             //    const a = 5;
             //   }
            //  );
          }
        ),
      this.bitstreamService
      .getUploadedFileList(this.sectionData.submissionId, this.sectionData.id)
      .subscribe((bitstreamList) => {
          let sectionStatus = false;
          this.bitstreamsList = bitstreamList;
          this.bitstreamsKeys = [];
          this.bitstreamsIndexes = [];
          if (isNotUndefined(this.bitstreamsList) && Object.keys(bitstreamList).length > 0) {
            this.bitstreamsKeys = Object.keys(bitstreamList);
            sectionStatus = true;
          }
          this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId,
            this.sectionData.id,
            sectionStatus));
        }
      )
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
