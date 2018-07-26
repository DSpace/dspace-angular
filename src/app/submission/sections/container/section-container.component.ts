import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { SectionsDirective } from '../sections.directive';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionState } from '../../submission.reducers';
import { rendersSectionType } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { AlertType } from '../../../shared/alerts/aletrs-type';

@Component({
  selector: 'ds-submission-form-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
})
export class SectionContainerComponent implements OnInit {
  @Input() collectionId: string;
  @Input() sectionData: SectionDataObject;
  @Input() submissionId: string;

  public AlertTypeEnum = AlertType;
  public active = true;
  public objectInjector: Injector;
  public sectionComponentType: SectionsType;

  @ViewChild('sectionRef') sectionRef: SectionsDirective;

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
