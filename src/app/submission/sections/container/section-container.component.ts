import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsDirective } from '../sections.directive';
import { rendersSectionType } from '../sections-decorator';

/**
 * This component represents a section that contains the submission license form.
 */
@Component({
  selector: 'ds-submission-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
  imports: [
    AlertComponent,
    NgForOf,
    NgbAccordionModule,
    NgComponentOutlet,
    TranslateModule,
    NgClass,
    NgIf,
    AsyncPipe,
    SectionsDirective,
  ],
  standalone: true,
})
export class SubmissionSectionContainerComponent implements OnInit {

  /**
   * The collection id this submission belonging to
   * @type {string}
   */
  @Input() collectionId: string;

  /**
   * The section data
   * @type {SectionDataObject}
   */
  @Input() sectionData: SectionDataObject;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * The SectionsDirective reference
   */
  @ViewChild('sectionRef') sectionRef: SectionsDirective;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'collectionIdProvider', useFactory: () => (this.collectionId), deps: [] },
        { provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps: [] },
        { provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps: [] },
      ],
      parent: this.injector,
    });
  }

  /**
   * Remove section from submission form
   *
   * @param event
   *    the event emitted
   */
  public removeSection(event) {
    event.preventDefault();
    event.stopPropagation();
    this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
  }

  /**
   * Find the correct component based on the section's type
   */
  getSectionContent() {
    return rendersSectionType(this.sectionData.sectionType);
  }
}
