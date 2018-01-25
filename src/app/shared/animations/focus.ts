import { animate, state, transition, trigger, style } from '@angular/animations';

export const focusShadow = trigger('focusShadow', [

  state('focus', style({ 'box-shadow': '0 0 6px #777777' })),

  state('blur', style({ 'box-shadow': 'none' })),

  transition('focus <=> blur', animate(250))
]);

export const focusBackground = trigger('focusBackground', [

  state('focus', style({ 'background-color': 'rgba(119, 119, 119, 0.1)' })),

  state('blur', style({ 'background-color': 'transparent' })),

  transition('focus <=> blur', animate(250))
]);
