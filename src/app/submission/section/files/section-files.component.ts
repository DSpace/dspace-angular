import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionModelComponent } from '../section.model';
import { hasValue, isNotUndefined } from '../../../shared/empty.util';
import { BitstreamService } from '../bitstream/bitstream.service';
import { SubmissionService } from '../../submission.service';
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
              private submissionService: SubmissionService,
              private collectionDataService: CollectionDataService,
              private store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.subs.push(
    //  this.collectionDataService.findById(this.sectionData.collectionId)
    // this.collectionDataService.findByHref('https://dspace7.dev01.4science.it/dspace-spring-rest/api/core/collections/1c11f3f1-ba1f-4f36-908a-3f1ea9a557eb/defaultBitstreamsPolicies')
    this.collectionDataService.findById(this.sectionData.collectionId)
      .filter((collectionData) => isNotUndefined((collectionData.payload)))
      .subscribe((collectionData) => {
        console.log(collectionData);
        this.collectionName = collectionData.payload.name
        }),
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
        ),
      /*this.submissionService
        .getCollectionPolicies(this.sectionData.submissionId)
        .subscribe((policies) => {
                                         this.collectionPolicies = policies;
                                       }
        ),
      this.submissionService
        .getCollectionName(this.sectionData.submissionId)
        .subscribe((collectionName) => {
            this.collectionName = collectionName;
          }
        ),
      this.submissionService
        .getCollectionPoliciesMessageType(this.sectionData.submissionId)
        .subscribe((collectionPoliciesMessageType) => {
            this.collectionPoliciesMessageType = collectionPoliciesMessageType;
          }
        )*/
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
