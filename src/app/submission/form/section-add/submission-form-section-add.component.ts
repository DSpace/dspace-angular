import { Component, Input, OnInit, } from '@angular/core';

import { Observable } from 'rxjs';

import { SectionsService } from '../../sections/sections.service';
import { HostWindowService } from '../../../shared/host-window.service';
import { SubmissionService } from '../../submission.service';
import { SectionDataObject } from '../../sections/models/section-data.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-submission-form-section-add',
  styleUrls: [ './submission-form-section-add.component.scss' ],
  templateUrl: './submission-form-section-add.component.html'
})
export class SubmissionFormSectionAddComponent implements OnInit {
  @Input() collectionId: string;
  @Input() submissionId: string;

  public sectionList$: Observable<SectionDataObject[]>;
  public hasSections$: Observable<boolean>;

  constructor(private sectionService: SectionsService,
              private submissionService: SubmissionService,
              public windowService: HostWindowService) {
  }

  ngOnInit() {
    this.sectionList$ = this.submissionService.getDisabledSectionsList(this.submissionId);
    this.hasSections$ = this.sectionList$.pipe(
      map((list: SectionDataObject[]) => list.length > 0)
    )
  }

  addSection(sectionId) {
    this.sectionService.addSection(this.submissionId, sectionId);
  }
}
