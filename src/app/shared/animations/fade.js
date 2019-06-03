import { animate, state, style, transition, trigger } from '@angular/animations';
export var fadeInState = state('fadeIn', style({ opacity: 1 }));
export var fadeInEnter = transition('* => fadeIn', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 }))
]);
var fadeEnter = transition(':enter', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 }))
]);
export var fadeOutState = state('fadeOut', style({ opacity: 0 }));
export var fadeOutLeave = transition('fadeIn => fadeOut', [
    style({ opacity: 1 }),
    animate(400, style({ opacity: 0 }))
]);
var fadeLeave = transition(':leave', [
    style({ opacity: 0 }),
    animate(300, style({ opacity: 1 }))
]);
export var fadeIn = trigger('fadeIn', [
    fadeEnter
]);
export var fadeOut = trigger('fadeOut', [
    fadeLeave
]);
export var fadeInOut = trigger('fadeInOut', [
    fadeEnter,
    fadeLeave
]);
//# sourceMappingURL=fade.js.map