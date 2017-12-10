import { ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { SectionService } from './section.service';

@Directive({
  selector: '[dsSection]',
  exportAs: 'sectionRef'
})
export class SectionDirective implements OnInit {
  @Input() mandatory = true;
  @Input() sectionId;
  @Input() submissionId;

  private animation = !this.mandatory;
  private sectionState = this.mandatory;
  private valid: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sectionService: SectionService) {}

  ngOnInit() {
    this.sectionService.isSectionValid(this.submissionId, this.sectionId)
      // Avoid 'ExpressionChangedAfterItHasBeenCheckedError' using debounceTime
      .debounceTime(1)
      .subscribe((valid) => {
          this.valid = valid;
          this.changeDetectorRef.detectChanges();
      });
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
