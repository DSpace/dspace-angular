import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SectionService } from './section.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { submissionSectionFromIdSelector } from '../selectors';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { SubmissionSectionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import { isEmpty, uniq } from 'lodash';
import { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import parseSectionErrorPaths from '../utils/parseSectionErrorPaths';
import {
  DeleteSectionErrorsAction, SaveSubmissionSectionFormAction,
  SetActiveSectionAction
} from '../objects/submission-objects.actions';
import { SubmissionService } from '../submission.service';

@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionDirective implements OnDestroy, OnInit {
  @Input() mandatory = true;
  @Input() sectionId;
  @Input() submissionId;

  private active = true;
  private animation = !this.mandatory;
  private sectionState = this.mandatory;
  private subs: Subscription[] = [];
  private valid: boolean;

  public sectionErrors: string[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private sectionService: SectionService,
              private submissionService: SubmissionService) {
  }

  ngOnInit() {
    this.subs.push(this.sectionService.isSectionValid(this.submissionId, this.sectionId)
    // Avoid 'ExpressionChangedAfterItHasBeenCheckedError' using debounceTime
      .debounceTime(1)
      .subscribe((valid: boolean) => {
        this.valid = valid;
        if (valid) {
          this.resetErrors();
        }
        this.changeDetectorRef.detectChanges();
      }));

    this.subs.push(
      this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionId))
        .filter((state: SubmissionSectionObject) => isNotUndefined(state))
        .map((state: SubmissionSectionObject) => state.errors)
        .filter((errors: SubmissionSectionError[]) => isNotEmpty(errors))
        .subscribe((errors: SubmissionSectionError[]) => {
          errors.forEach((errorItem: SubmissionSectionError) => {
            const parsedErrors: SectionErrorPath[] = parseSectionErrorPaths(errorItem.path);

            if (!isEmpty(parsedErrors)) {
              parsedErrors.forEach((error: SectionErrorPath) => {
                if (!error.fieldId) {
                  this.sectionErrors = uniq(this.sectionErrors.concat(errorItem.message));

                  // because it has been shown, remove the error from the state
                  const removeAction = new DeleteSectionErrorsAction(this.submissionId, this.sectionId, errorItem);
                  this.store.dispatch(removeAction);
                }
              });
            } else {
              this.resetErrors();
            }
          });
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
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  protected checkActiveSection(activeSection:string) {
    console.log(activeSection);
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

  public isSectionActive() {
    return this.active;
  }

  public isValid() {
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

  public resetErrors() {
    return this.sectionErrors = [];
  }
}
