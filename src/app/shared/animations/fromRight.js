import { animate, state, style, transition, trigger } from '@angular/animations';
export var fromRightInState = state('fromRightIn', style({ opacity: 1, transform: 'translateX(0)' }));
export var fromRightEnter = transition('* => fromRightIn', [
    style({ opacity: 0, transform: 'translateX(5%)' }),
    animate('400ms ease-in-out')
]);
export var fromRightOutState = state('fromRightOut', style({ opacity: 0, transform: 'translateX(-5%)' }));
export var fromRightLeave = transition('fromRightIn => fromRightOut', [
    style({ opacity: 1, transform: 'translateX(0)' }),
    animate('300ms ease-in-out')
]);
export var fromRightIn = trigger('fromRightIn', [
    fromRightEnter
]);
export var fromRightOut = trigger('fromRightOut', [
    fromRightLeave
]);
export var fromRightInOut = trigger('fromRightInOut', [
    fromRightEnter,
    fromRightLeave
]);
//# sourceMappingURL=fromRight.js.map