import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import uniq from 'lodash/uniq';

import { SectionsService } from './sections.service';
import { hasValue, isNotEmpty, isNotNull } from '../../shared/empty.util';
import parseSectionErrorPaths, { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import { SubmissionService } from '../submission.service';
import { SectionsType } from './sections-type';
import { SubmissionSectionError } from '../objects/submission-section-error.model';

/**
 * Directive for handling generic section functionality
 */
@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionsDirective implements OnDestroy, OnInit {

  /**
   * A boolean representing if section is mandatory
   * @type {boolean}
   */
  @Input() mandatory = true;

  /**
   * A boolean representing if section is opened by default
   * @type {boolean}
   */
  @Input() opened = true;

  /**
   * The section id
   * @type {string}
   */
  @Input() sectionId: string;

  /**
   * The section type
   * @type {SectionsType}
   */
  @Input() sectionType: SectionsType;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The list of generic errors related to the section
   * @type {Array}
   */
  public genericSectionErrors: string[] = [];

  /**
   * The list of all errors related to the element belonging to this section
   * @type {Array}
   */
  public allSectionErrors: string[] = [];

  /**
   * A boolean representing if section is active
   * @type {boolean}
   */
  private active = true;

  /**
   * A boolean representing if section is enabled
   * @type {boolean}
   */
  private enabled: Observable<boolean>;

  /**
   * A boolean representing if section has read-only visibility
   * @type {boolean}
   */
  private readOnly: Observable<boolean>;

  /**
   * A boolean representing the panel collapsible state: opened (true) or closed (false)
   * @type {boolean}
   */
  private sectionState: boolean;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Dedicated properties for error checking
   * @private
   */
  private errorsSub: Subscription;

  /**
   * A boolean representing if section is valid
   * @type {boolean}
   */
  private valid: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {SubmissionService} submissionService
   * @param {SectionsService} sectionService
   */
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private sectionService: SectionsService) {
  }

  /**
   * Initialize instance variables
   */
  ngOnInit() {
    this.sectionState = this.isOpened();
    this.valid = this.sectionService.isSectionValid(this.submissionId, this.sectionId).pipe(
      map((valid: boolean) => {
        if (valid) {
          this.resetErrors();
        } else if (hasValue(this.errorsSub)) {
          //create new subscription to set any possible remaining error, so to avoid timing issue in status update
          this.errorsSub.unsubscribe();
          this.checkForNewErrors();
        }
        return valid;
      }));

    this.errorsSub = this.checkForNewErrors();
    this.subs.push(
      this.submissionService.getActiveSectionId(this.submissionId)
        .subscribe((activeSectionId) => {
          const previousActive = this.active;
          this.active = (activeSectionId === this.sectionId);
          if (previousActive !== this.active) {
            this.changeDetectorRef.detectChanges();
            // If section is no longer active dispatch save action
            if (!this.active && isNotNull(activeSectionId)) {
              this.submissionService.dispatchSave(this.submissionId);
            }
          }
        })
    );

    this.enabled = this.sectionService.isSectionEnabled(this.submissionId, this.sectionId);
    this.readOnly = this.sectionService.isSectionReadOnly(
      this.submissionId,
      this.sectionId,
      this.submissionService.getSubmissionScope()
    );
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Change section state
   *
   * @param event
   *    the event emitted
   */
  public sectionChange(event) {
    this.sectionState = event.nextState;
  }

  /**
   * Check if section panel is open
   *
   * @returns {boolean}
   *    Returns true when section panel is open
   */
  public isOpen(): boolean {
    return this.sectionState;
  }

  /**
   * Check if section is mandatory
   *
   * @returns {boolean}
   *    Returns true when section is mandatory
   */
  public isMandatory(): boolean {
    return this.mandatory;
  }

  /**
   * Check if section is mandatory
   *
   * @returns {boolean}
   *    Returns true when section is mandatory
   */
  public isOpened(): boolean {
    return this.opened;
  }

  /**
   * Check if section panel is active
   *
   * @returns {boolean}
   *    Returns true when section panel is active
   */
  public isSectionActive(): boolean {
    return this.active;
  }

  /**
   * Check if section is enabled
   *
   * @returns {Observable<boolean>}
   *    Emits true whenever section is enabled
   */
  public isEnabled(): Observable<boolean> {
    return this.enabled;
  }

  /**
   * Check if section has visibility read only
   *
   * @returns {Observable<boolean>}
   *    Emits true whenever section is read only
   */
  public isReadOnly(): Observable<boolean> {
    return this.readOnly;
  }

  /**
   * Check if section is valid
   *
   * @returns {Observable<boolean>}
   *    Emits true whenever section is valid
   */
  public isValid(): Observable<boolean> {
    return this.valid;
  }

  /**
   * Remove section panel from submission form
   *
   * @param submissionId
   *    the submission id
   * @param sectionId
   *    the section id
   * @returns {Observable<boolean>}
   *    Emits true whenever section is valid
   */
  public removeSection(submissionId: string, sectionId: string) {
    this.sectionService.dispatchRemoveSection(submissionId, sectionId);
  }

  /**
   * Check if section has only generic errors
   *
   * @returns {boolean}
   *    Returns true when section has only generic errors
   */
  public hasGenericErrors(): boolean {
    return this.genericSectionErrors && this.genericSectionErrors.length > 0;
  }

  /**
   * Check if section has errors
   *
   * @returns {boolean}
   *    Returns true when section has errors
   */
  public hasErrors(): boolean {
    return (this.genericSectionErrors && this.genericSectionErrors.length > 0) ||
      (this.allSectionErrors && this.allSectionErrors.length > 0);
  }

  /**
   * Return section errors
   *
   * @returns {Array}
   *    Returns section errors list
   */
  public getErrors(): string[] {
    return this.genericSectionErrors;
  }

  /**
   * Set form focus to this section panel
   *
   * @param event
   *    The event emitted
   */
  public setFocus(event): void {
    if (!this.active) {
      this.submissionService.setActiveSection(this.submissionId, this.sectionId);
    }
  }


  /**
   * Check if section is information
   *
   * @returns {Observable<boolean>}
   *    Emits true whenever section is information
   */
  public isInfo(): boolean {
    return this.sectionService.getIsInformational(this.sectionType);
  }



  /**
   * Remove error from list
   *
   * @param index
   *    The error array key
   */
  public removeError(index): void {
    this.genericSectionErrors.splice(index);
  }

  /**
   * Remove all errors from list
   */
  public resetErrors() {
    if (isNotEmpty(this.genericSectionErrors)) {
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionId);
    }
    this.genericSectionErrors = [];
    this.allSectionErrors = [];

  }

  private checkForNewErrors() {
    return this.sectionService.getShownSectionErrors(this.submissionId, this.sectionId, this.sectionType)
      .subscribe((errors: SubmissionSectionError[]) => {
        if (isNotEmpty(errors)) {
          errors.forEach((errorItem: SubmissionSectionError) => {
            const parsedErrors: SectionErrorPath[] = parseSectionErrorPaths(errorItem.path);

            parsedErrors.forEach((error: SectionErrorPath) => {
              if (!error.fieldId) {
                this.genericSectionErrors = uniq(this.genericSectionErrors.concat(errorItem.message));
              } else {
                this.allSectionErrors.push(errorItem.message);
              }
            });
          });
        } else {
          this.resetErrors();
        }
      });
  }
}
