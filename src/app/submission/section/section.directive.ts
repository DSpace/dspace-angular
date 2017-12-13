import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SectionService } from './section.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { submissionSectionFromIdSelector } from '../selectors';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { SubmissionError, SubmissionSectionObject } from '../objects/submission-objects.reducer';
import { isEmpty } from 'lodash';
import { SectionErrorPath } from '../utils/parseSectionErrorPaths';
import parseSectionErrorPaths from '../utils/parseSectionErrorPaths';

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
      .subscribe((valid) => {
        this.valid = valid;
        this.changeDetectorRef.detectChanges();
      }));

    this.subs.push(
      this.store.select(submissionSectionFromIdSelector(this.submissionId, this.sectionId))
        .filter((state: SubmissionSectionObject) => !!state && isNotEmpty(state.errors))
        .map((state: SubmissionSectionObject) => state.errors)
        .filter((errors: SubmissionError[]) => !isEmpty(errors))
        .distinctUntilChanged()
        .subscribe((errors: SubmissionError[]) => {
          errors.forEach((errorItem: SubmissionError) => {
            const parsedErrors: SectionErrorPath[] = parseSectionErrorPaths(errorItem.path);

            parsedErrors.forEach((error: SectionErrorPath) => {
              if (!error.fieldId) {
                this.sectionErrors.push(errorItem.messageKey);
              }
            });
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
