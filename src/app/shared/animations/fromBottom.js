import { animate, state, style, transition, trigger } from '@angular/animations';
export var fromBottomInState = state('fromBottomIn', style({ opacity: 1, transform: 'translateY(0)' }));
export var fromBottomEnter = transition('* => fromBottomIn', [
    style({ opacity: 0, transform: 'translateY(5%)' }),
    animate('400ms ease-in-out')
]);
export var fromBottomOutState = state('fromBottomOut', style({ opacity: 0, transform: 'translateY(-5%)' }));
export var fromBottomLeave = transition('fromBottomIn => fromBottomOut', [
    style({ opacity: 1, transform: 'translateY(0)' }),
    animate('300ms ease-in-out')
]);
export var fromBottomIn = trigger('fromBottomIn', [
    fromBottomEnter
]);
export var fromBottomOut = trigger('fromBottomOut', [
    fromBottomLeave
]);
export var fromBottomInOut = trigger('fromBottomInOut', [
    fromBottomEnter,
    fromBottomLeave
]);
//# sourceMappingURL=fromBottom.js.map