import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const pushInOut = trigger('pushInOut', [

  /*
  state('expanded', style({ right: '100%' }));

  state('collapsed', style({ right: 0 }));
*/

  state('expanded', style({ left: '100%' })),

  state('collapsed', style({ left: 0 })),

  transition('expanded <=> collapsed', animate(250)),
]);
