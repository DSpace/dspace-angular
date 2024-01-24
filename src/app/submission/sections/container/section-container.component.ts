import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';

import { ThemeService } from 'src/app/shared/theme-support/theme.service';
import { AlertType } from '../../../shared/alert/alert-type';
import { SectionDataObject } from '../models/section-data.model';
import { rendersSectionType } from '../sections-decorator';
import { SectionsDirective } from '../sections.directive';

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
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * The SectionsDirective reference
   */
  @ViewChild('sectionRef') sectionRef: SectionsDirective;

  // TAMU Customization - theme service to get active theme
  private themeService: ThemeService;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {
    // TAMU Customization - inject theme service
    this.themeService = injector.get(ThemeService);
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
      parent: this.injector
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
  getSectionContent(): string {
    // TAMU Customization - provide injected active theme to get themed section to render
    let theme = this.themeService.getThemeName();
    let themeConfig = this.themeService.getThemeConfigFor(theme);
    // get theme "root class"
    while (!!themeConfig.extends) {
      themeConfig = this.themeService.getThemeConfigFor(theme);
    }

    return rendersSectionType(this.sectionData.sectionType, themeConfig.name);
    // return rendersSectionType(this.sectionData.sectionType);
  }
}
