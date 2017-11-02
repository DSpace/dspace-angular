import { Component } from '@angular/core';

import { SectionModelComponent } from '../section.model';
import { hasValue } from '../../../shared/empty.util';
import { BitstreamService } from '../bitstream/bitstream.service';
import { SubmissionService } from '../../submission.service';

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

  constructor(private bitstreamService: BitstreamService, private submissionService: SubmissionService) {
    super();
  }

  ngOnInit() {
    this.subs.push(
      this.bitstreamService
        .getBitstreamList(this.sectionData.submissionId)
        .subscribe((bitstreamList) => {
                                             this.bitstreamsList = bitstreamList;
                                             this.bitstreamsKeys = Object.keys(bitstreamList);
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
