import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SectionService } from './section.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { submissionSectionFromIdSelector } from '../selectors';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { SubmissionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import { isEmpty, uniq } from 'lodash';
import { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import parseSectionErrorPaths from '../utils/parseSectionErrorPaths';
import { DeleteSectionErrorsAction } from '../objects/submission-objects.actions';

@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionDirective implements OnDestroy, OnInit {
  @Input() mandatory = true;
  @Input() sectionId;
  @Input() submissionId;

  private animation = !this.mandatory;
  private sectionState = this.mandatory;
  private subs: Subscription[] = [];
  private valid: boolean;

  public sectionErrors: string[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private store: Store<SubmissionState>,
              private sectionService: SectionService) {
  }

  ngOnInit() {
    this.subs.push(this.sectionService.isSectionValid(this.submissionId, this.sectionId)
    // Avoid 'ExpressionChangedAfterItHasBeenCheckedError' using debounceTime
      .debounceTime(1)
      .subscribe((valid: boolean) => {
        this.valid = valid;
        if (valid) {
          this.sectionErrors = [];
        }
        this.changeDetectorRef.detectChanges();
      }));

    this.subs.push(
      this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionId))
        .map((state: SubmissionSectionObject) => state.errors)
        .distinctUntilChanged()
        .subscribe((errors: SubmissionError[]) => {
          errors.forEach((errorItem: SubmissionError) => {
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
              this.sectionErrors = [];
            }
          });
        })
    );
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

  public resetErrors() {
    return this.sectionErrors = [];
  }
}
