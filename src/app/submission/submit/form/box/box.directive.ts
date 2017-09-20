import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[dsBox]',
  exportAs: 'boxRef'
})
export class BoxDirective {
  @Input() mandatory = false;
  @Input() animation = false;

  panelState = false;

  public panelChange(event) {
    this.panelState = event.nextState;
  }

  public isOpen() {
    return (this.panelState) ? true : false;
  }

  public isOptional() {
    return !this.mandatory;
  }

  public isAnimationsActive() {
    return this.animation;
  }
}
