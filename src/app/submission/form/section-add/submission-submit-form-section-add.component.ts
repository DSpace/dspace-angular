import {
  Component,
  Input, OnChanges,
  SimpleChanges,
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { SectionService } from '../../section/section.service';

import { hasValue, isNotUndefined } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-submit-form-box-handler',
  styleUrls: [ './submission-submit-form-section-add.component.scss' ],
  templateUrl: './submission-submit-form-section-add.component.html'
})
export class SubmissionSubmitFormSectionAddComponent implements OnChanges {
  @Input() collectionId: string;
  @Input() submissionId: string;
  @Input() definitionId: string;
  sectionList: any[] = [];

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  constructor(private sectionService: SectionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isNotUndefined(changes.definitionId) && hasValue(changes.definitionId.currentValue)) {
      this.subs.push(this.sectionService.getAvailableSectionList(this.submissionId, this.definitionId)
        .subscribe((sectionList) => {
          this.sectionList = sectionList;
        }));
    }
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  addSection(sectionId) {
    this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, sectionId);
  }
}
