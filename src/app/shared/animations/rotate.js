import { animate, state, style, transition, trigger } from '@angular/animations';
export var rotateInState = state('rotateIn', style({ opacity: 1, transform: 'rotate(0deg)' }));
export var rotateEnter = transition('* => rotateIn', [
    style({ opacity: 0, transform: 'rotate(5deg)' }),
    animate('400ms ease-in-out')
]);
export var rotateOutState = state('rotateOut', style({ opacity: 0, transform: 'rotate(5deg)' }));
export var rotateLeave = transition('rotateIn => rotateOut', [
    style({ opacity: 1, transform: 'rotate(0deg)' }),
    animate('400ms ease-in-out')
]);
export var rotateIn = trigger('rotateIn', [
    rotateEnter
]);
export var rotateOut = trigger('rotateOut', [
    rotateLeave
]);
export var rotateInOut = trigger('rotateInOut', [
    rotateEnter,
    rotateLeave
]);
var expandedStyle = { transform: 'rotate(90deg)' };
var collapsedStyle = { transform: 'rotate(0deg)' };
export var rotate = trigger('rotate', [
    state('expanded', style(expandedStyle)),
    state('collapsed', style(collapsedStyle)),
    transition('expanded <=> collapsed', [
        animate('200ms')
    ])
]);
//# sourceMappingURL=rotate.js.map