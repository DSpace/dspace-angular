import { animate, state, style, transition, trigger } from '@angular/animations';
export var fromTopInState = state('fromTopIn', style({ opacity: 1, transform: 'translateY(0)' }));
export var fromTopEnter = transition('* => fromTopIn', [
    style({ opacity: 0, transform: 'translateY(-5%)' }),
    animate('400ms ease-in-out')
]);
export var fromTopOutState = state('fromTopOut', style({ opacity: 0, transform: 'translateY(5%)' }));
export var fromTopLeave = transition('fromTopIn => fromTopOut', [
    style({ opacity: 1, transform: 'translateY(0)' }),
    animate('300ms ease-in-out')
]);
export var fromTopIn = trigger('fromTopIn', [
    fromTopEnter
]);
export var fromTopOut = trigger('fromTopOut', [
    fromTopLeave
]);
export var fromTopInOut = trigger('fromTopInOut', [
    fromTopEnter,
    fromTopLeave
]);
//# sourceMappingURL=fromTop.js.map