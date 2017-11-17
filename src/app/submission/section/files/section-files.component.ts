import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionModelComponent } from '../section.model';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { BitstreamService } from '../bitstream/bitstream.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SubmissionState } from '../../submission.reducers';
import { CollectionDataService } from '../../../core/data/collection-data.service';

@Component({
  selector: 'ds-submission-section-files',
  styleUrls: ['./section-files.component.scss'],
  templateUrl: './section-files.component.html',
})
export class FilesSectionComponent extends SectionModelComponent {

  public bitstreamsKeys = [];
  public bitstreamsList;
  public collectionPolicies = [];
  public collectionName;
  public collectionPoliciesMessageType;

  protected subs = [];

  constructor(private bitstreamService: BitstreamService,
              private collectionDataService: CollectionDataService,
              private store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.subs.push(
      this.collectionDataService.findById(this.sectionData.collectionId)
        .filter((collectionData) => isNotUndefined((collectionData.payload)))
        .subscribe((collectionData) => {
            console.log(collectionData);
            this.collectionName = collectionData.payload.name
            // collectionData.accessConditions.
          /*
          [
      {
        "policyType": lease,
        "groupUUID": "11cc35e5-a11d-4b64-b5b9-0052a5d15509",
        "endDate": null,
        "type": "accessCondition"
      }
    ]
           */
          }
        ),
      this.bitstreamService
        .getBitstreamList(this.sectionData.submissionId, this.sectionData.id)
        .subscribe((bitstreamList) => {
            let sectionStatus = false;
            this.bitstreamsList = bitstreamList;
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
