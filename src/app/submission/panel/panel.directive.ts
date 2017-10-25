import { Directive, Input } from '@angular/core';
import { PanelService } from './panel.service';

@Directive({
  selector: '[dsPanel]',
  exportAs: 'panelRef'
})
export class PanelDirective {
  @Input() mandatory = true;
  @Input() checkable = true;

  @Input() submissionId;
  @Input() panelId;

  isValid    = false;
  animation  = !this.mandatory;
  panelState = this.mandatory;

  constructor(private panelService: PanelService) {}

  ngAfterViewInit() {
    this.panelService.getPanelState(this.submissionId, this.panelId)
      .subscribe((state) => {
        if (state) {
          this.isValid = state.isValid;
        }
      });
  }

  public panelChange(event) {
    this.panelState = event.nextState;
  }

  public isOpen() {
    return (this.panelState) ? true : false;
  }

  public isCheckable() {
    return this.checkable;
  }

  public isMandatory() {
    return this.mandatory;
  }

  public isAnimationsActive() {
    return this.animation;
  }

  public removePanel(submissionId, panelId) {
    this.panelService.removePanel(submissionId, panelId)
  }
}
