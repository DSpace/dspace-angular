import { Directive, Input } from '@angular/core';
import { PanelService } from './panel.service';

@Directive({
  selector: '[dsPanel]',
  exportAs: 'panelRef'
})
export class PanelDirective {
  @Input() mandatory = true;

  animation = !this.mandatory;
  panelState = this.mandatory;

  constructor(private panelService: PanelService) {}

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

  public removePanel(submissionId, panelId) {
    this.panelService.removePanel(submissionId, panelId)
  }
}
