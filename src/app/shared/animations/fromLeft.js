import { animate, state, style, transition, trigger } from '@angular/animations';
export var fromLeftInState = state('fromLeftIn', style({ opacity: 1, transform: 'translateX(0)' }));
export var fromLeftEnter = transition('* => fromLeftIn', [
    style({ opacity: 0, transform: 'translateX(-5%)' }),
    animate('400ms ease-in-out')
]);
export var fromLeftOutState = state('fromLeftOut', style({ opacity: 0, transform: 'translateX(5%)' }));
export var fromLeftLeave = transition('fromLeftIn => fromLeftOut', [
    style({ opacity: 1, transform: 'translateX(0)' }),
    animate('300ms ease-in-out')
]);
export var fromLeftIn = trigger('fromLeftIn', [
    fromLeftEnter
]);
export var fromLeftOut = trigger('fromLeftOut', [
    fromLeftLeave
]);
export var fromLeftInOut = trigger('fromLeftInOut', [
    fromLeftEnter,
    fromLeftLeave
]);
//# sourceMappingURL=fromLeft.js.map