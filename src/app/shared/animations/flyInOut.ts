import { animate, state, style, transition, trigger } from '@angular/animations';

/* The element here always has the state "in" when it
 * is present. We animate two transitions: From void
 * to in and from in to void, to achieve an animated
 * enter and leave transition. The element enters from
 * the left and leaves to the right using translateX.
 */
export const flyInOut = [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(300)
    ]),
    transition('* => void', [
      animate(300, style({transform: 'translateX(100%)'}))
    ])
  ])
];
