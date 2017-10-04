import { animate, state, transition, trigger, style, keyframes } from '@angular/animations';

const fadeEnter =  transition(':enter', [
  style({ opacity: 0 }),
  animate(300, style({ opacity: 1 }))
]);

const fadeLeave = transition(':leave', [
  style({ opacity: 1 }),
  animate(400, style({ opacity: 0 }))
]);

export const fadeIn = trigger('fadeIn', [
  fadeEnter
]);

export const fadeOut = trigger('fadeOut', [
  fadeLeave
]);

export const fadeInOut = trigger('fadeInOut', [
  fadeEnter,
  fadeLeave
]);
