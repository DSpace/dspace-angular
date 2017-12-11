import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SectionService } from './section.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../../shared/empty.util';

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

  constructor(private changeDetectorRef: ChangeDetectorRef, private sectionService: SectionService) {}

  ngOnInit() {
    this.subs.push(this.sectionService.isSectionValid(this.submissionId, this.sectionId)
      // Avoid 'ExpressionChangedAfterItHasBeenCheckedError' using debounceTime
      .debounceTime(1)
      .subscribe((valid) => {
          this.valid = valid;
          this.changeDetectorRef.detectChanges();
      }));
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
}
