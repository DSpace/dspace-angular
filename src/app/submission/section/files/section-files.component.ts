import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SectionModelComponent } from '../section.model';
import { hasValue } from '../../../shared/empty.util';
import { BitstreamService } from '../bitstream/bitstream.service';
import { SubmissionService } from '../../submission.service';
import { SectionStatusChangeAction } from '../../objects/submission-objects.actions';
import { SubmissionState } from '../../submission.reducers';

@Component({
  selector: 'ds-submission-section-files',
  styleUrls: ['./section-files.component.scss'],
  templateUrl: './section-files.component.html',
})
export class FilesSectionComponent extends SectionModelComponent {

  public bitstreamsKeys;
  public bitstreamsList;
  public collectionPolicies;
  public collectionName;
  public collectionPoliciesMessageType;

  protected subs = [];

  constructor(private bitstreamService: BitstreamService,
              private submissionService: SubmissionService,
              private store:Store<SubmissionState>) {
    super();
  }

  ngOnInit() {
    this.subs.push(
      this.bitstreamService
        .getBitstreamList(this.sectionData.submissionId)
        .subscribe((bitstreamList) => {
            let sectionStatus = false;
            this.bitstreamsList = bitstreamList;
            this.bitstreamsKeys = Object.keys(bitstreamList);
            if (this.bitstreamsKeys.length > 0) {
              sectionStatus = true;
            }
            this.store.dispatch(new SectionStatusChangeAction(this.sectionData.submissionId,
                                                              this.sectionData.id,
                                                              sectionStatus));
          }
        ),
      this.submissionService
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
