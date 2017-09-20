import { ChangeDetectorRef, Component, Input, ViewContainerRef } from '@angular/core';
import { BoxModelComponent } from '../box.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ds-submission-submit-form-box-default',
  styleUrls: ['./submission-submit-form-box-default.component.scss'],
  templateUrl: './submission-submit-form-box-default.component.html',
  /* The element here always has the state "in" when it
   * is present. We animate two transitions: From void
   * to in and from in to void, to achieve an animated
   * enter and leave transition. The element enters from
   * the left and leaves to the right using translateX.
   */
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class DefaultBoxComponent extends BoxModelComponent {

}
