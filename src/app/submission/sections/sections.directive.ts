import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { uniq } from 'lodash';

import { SectionsService } from './sections.service';
import { hasValue, isNotEmpty, isNotNull } from '../../shared/empty.util';
import { SubmissionSectionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import parseSectionErrorPaths, { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import { SubmissionService } from '../submission.service';

@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionsDirective implements OnDestroy, OnInit {
  @Input() mandatory = true;
  @Input() sectionId;
  @Input() submissionId;
  public genericSectionErrors: string[] = [];
  public allSectionErrors: string[] = [];
  private active = true;
  private animation = !this.mandatory;
  private enabled: Observable<boolean>;
  private sectionState = this.mandatory;
  private subs: Subscription[] = [];
  private valid: Observable<boolean>;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private submissionService: SubmissionService,
              private sectionService: SectionsService) {
  }

  ngOnInit() {
    this.valid = this.sectionService.isSectionValid(this.submissionId, this.sectionId).pipe(
      map((valid: boolean) => {
        if (valid) {
          this.resetErrors();
        }
        return valid;
      }));

    this.subs.push(
      this.sectionService.getSectionState(this.submissionId, this.sectionId).pipe(
        map((state: SubmissionSectionObject) => state.errors))
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
        }),
      this.submissionService.getActiveSectionId(this.submissionId)
        .subscribe((activeSectionId) => {
          const previousActive = this.active;
          this.active = (activeSectionId === this.sectionId);
          if (previousActive !== this.active) {
            this.changeDetectorRef.detectChanges();
            // If section is no longer active dispatch save action
            if (!this.active && isNotNull(activeSectionId)) {
              this.submissionService.dispatchSaveSection(this.submissionId, this.sectionId);
            }
          }
        })
    );

    this.enabled = this.sectionService.isSectionEnabled(this.submissionId, this.sectionId);
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  public sectionChange(event) {
    this.sectionState = event.nextState;
  }

  public isOpen() {
    return (this.sectionState) ? true : false;
  }

  public isMandatory() {
    return this.mandatory;
  }

  public isAnimationsActive() {
    return this.animation;
  }

  public isSectionActive(): boolean {
    return this.active;
  }

  public isEnabled(): Observable<boolean> {
    return this.enabled;
  }

  public isValid(): Observable<boolean> {
    return this.valid;
  }

  public removeSection(submissionId, sectionId) {
    this.sectionService.removeSection(submissionId, sectionId)
  }

  public hasGenericErrors() {
    return this.genericSectionErrors && this.genericSectionErrors.length > 0
  }

  public hasErrors() {
    return (this.genericSectionErrors && this.genericSectionErrors.length > 0) ||
      (this.allSectionErrors && this.allSectionErrors.length > 0)
  }

  public getErrors() {
    return this.genericSectionErrors;
  }

  public setFocus(event) {
    if (!this.active) {
      this.submissionService.setActiveSection(this.submissionId, this.sectionId);
    }
  }

  public removeError(index) {
    this.genericSectionErrors.splice(index);
  }

  public resetErrors() {
    if (isNotEmpty(this.genericSectionErrors)) {
      this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionId);
    }
    this.genericSectionErrors = [];
    this.allSectionErrors = [];

  }
}
