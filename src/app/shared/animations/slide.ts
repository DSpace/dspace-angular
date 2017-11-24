import { animate, state, transition, trigger, style, stagger, query } from '@angular/animations';

export const slide = trigger('slide', [

  state('expanded', style({ height: '*' })),

  state('collapsed', style({ height: 0 })),

  transition('expanded <=> collapsed', animate(250))
]);
