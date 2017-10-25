import { Directive, Input, OnInit } from '@angular/core';
import { PanelService } from './panel.service';

@Directive({
  selector: '[dsPanel]',
  exportAs: 'panelRef'
})
export class PanelDirective implements OnInit {
  @Input() mandatory = true;
  @Input() submissionId;
  @Input() panelId;

  valid: boolean;
  animation  = !this.mandatory;
  panelState = this.mandatory;

  constructor(private panelService: PanelService) {}

  ngOnInit() {
    this.panelService.isPanelValid(this.submissionId, this.panelId)
      // Avoid 'ExpressionChangedAfterItHasBeenCheckedError' using debounceTime
      .debounceTime(1)
      .subscribe((valid) => {
          this.valid = valid;
      });
  }

  public panelChange(event) {
    this.panelState = event.nextState;
  }

  public isOpen() {
    return (this.panelState) ? true : false;
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

  public removePanel(submissionId, panelId) {
    this.panelService.removePanel(submissionId, panelId)
  }
}
