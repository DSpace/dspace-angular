import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { SectionDirective } from '../section.directive';
import { SectionDataObject } from '../section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { rendersSectionType } from '../section-decorator';
import { SectionType } from '../section-type';

@Component({
  selector: 'ds-submission-form-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
})
export class SectionContainerComponent implements OnInit {
  @Input() collectionId: string;
  @Input() sectionData: SectionDataObject;
  @Input() submissionId: string;

  public active = true;
  public objectInjector: Injector;
  public sectionComponentType: SectionType;

  @ViewChild('sectionRef') sectionRef: SectionDirective;

  constructor(private injector: Injector, private store: Store<SubmissionState>) {
  }

  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        {provide: 'collectionIdProvider', useFactory: () => (this.collectionId), deps: []},
        {provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps: []},
        {provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps: []},
      ],
      parent: this.injector
    });
  }

  public removeSection(event) {
    event.preventDefault();
    event.stopPropagation();
    this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
  }

  getSectionContent(): string {
    return rendersSectionType(this.sectionData.sectionType);
  }
}
