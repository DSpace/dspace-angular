import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { trigger } from '@angular/animations';

import { AlertType } from './aletrs-type';
import { fadeOutLeave, fadeOutState } from '../animations/fade';

@Component({
  selector: 'ds-alert',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ])
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

export class AlertsComponent {

  @Input() content: string;
  @Input() dismissible = false;
  @Input() type: AlertType;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  public animate = 'fadeIn';
  public dismissed = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  dismiss() {
    if (this.dismissible) {
      this.animate = 'fadeOut';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.dismissed = true;
        this.close.emit();
        this.cdr.detectChanges();
      }, 300);

    }
  }
}
