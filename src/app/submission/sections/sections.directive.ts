import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty, uniq } from 'lodash';

import { SectionsService } from './sections.service';
import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { submissionSectionFromIdSelector } from '../selectors';
import { SubmissionState } from '../submission.reducers';
import { SubmissionSectionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import parseSectionErrorPaths, { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import {
  DeleteSectionErrorsAction,
  SaveSubmissionSectionFormAction,
  SetActiveSectionAction
} from '../objects/submission-objects.actions';
import { SubmissionService } from '../submission.service';

@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionsDirective implements OnDestroy, OnInit {
  @Input() mandatory = true;
  @Input() sectionId;
  @Input() submissionId;
  public sectionErrors: string[] = [];
  private active = true;
  private animation = !this.mandatory;
  private enabled: Observable<boolean>;
  private sectionState = this.mandatory;
  private subs: Subscription[] = [];
  private valid: Observable<boolean>;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private submissionService: SubmissionService,
              private sectionService: SectionsService) {
  }

  ngOnInit() {
    this.valid = this.sectionService.isSectionValid(this.submissionId, this.sectionId)
      .map((valid: boolean) => {
        if (valid) {
          this.resetErrors();
        }
        return valid;
      });

    this.subs.push(
      this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionId))
        .filter((state: SubmissionSectionObject) => isNotUndefined(state))
        .map((state: SubmissionSectionObject) => state.errors)
        // .filter((errors: SubmissionSectionError[]) => isNotEmpty(errors))
        .subscribe((errors: SubmissionSectionError[]) => {
          if (isNotEmpty(errors)) {
            errors.forEach((errorItem: SubmissionSectionError) => {
              const parsedErrors: SectionErrorPath[] = parseSectionErrorPaths(errorItem.path);

              parsedErrors.forEach((error: SectionErrorPath) => {
                if (!error.fieldId) {
                  this.sectionErrors = uniq(this.sectionErrors.concat(errorItem.message));
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
              this.store.dispatch(new SaveSubmissionSectionFormAction(this.submissionId, this.sectionId));
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

  public hasErrors() {
    return this.sectionErrors && this.sectionErrors.length > 0
  }

  public getErrors() {
    return this.sectionErrors;
  }

  public setFocus(event) {
    if (!this.active) {
      this.store.dispatch(new SetActiveSectionAction(this.submissionId, this.sectionId));
    }
  }

  public removeError(index) {
    this.sectionErrors.splice(index);
  }

  public resetErrors() {
    this.sectionErrors
      .forEach((errorItem) => {
        // because it has been deleted, remove the error from the state
        const removeAction = new DeleteSectionErrorsAction(this.submissionId, this.sectionId, errorItem);
        this.store.dispatch(removeAction);
      })
    this.sectionErrors = [];

  }
}
