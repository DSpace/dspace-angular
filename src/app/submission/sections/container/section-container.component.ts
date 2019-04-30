import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';

import { SectionsDirective } from '../sections.directive';
import { SectionDataObject } from '../models/section-data.model';
import { rendersSectionType } from '../sections-decorator';
import { AlertType } from '../../../shared/alert/aletr-type';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';

/**
 * This component represents a section that contains the submission license form.
 */
@Component({
  selector: 'ds-submission-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss']
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
   * A boolean representing if a section delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public isRemoving: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The SectionsDirective reference
   */
  @ViewChild('sectionRef') sectionRef: SectionsDirective;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   */
  constructor(private injector: Injector, private operationsBuilder: JsonPatchOperationsBuilder) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        {provide: 'collectionIdProvider', useFactory: () => (this.collectionId), deps: []},
        {provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps: []},
        {provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps: []},
      ],
      parent: this.injector
    });
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
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

    if (this.isRemoving.value === false) {
      this.isRemoving.next(true);
      this.operationsBuilder.remove(this.pathCombiner.getPath());
      this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
    }
  }

  /**
   * Find the correct component based on the section's type
   */
  getSectionContent(): string {
    return rendersSectionType(this.sectionData.sectionType);
  }
}
