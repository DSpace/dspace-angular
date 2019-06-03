import { animate, state, style, transition, trigger } from '@angular/animations';
export var scaleInState = state('scaleIn', style({ opacity: 1, transform: 'scale(1)' }));
export var scaleEnter = transition('* => scaleIn', [
    style({ opacity: 0, transform: 'scale(0)' }),
    animate('400ms ease-in-out')
]);
export var scaleOutState = state('scaleOut', style({ opacity: 0, transform: 'scale(0)' }));
export var scaleLeave = transition('scaleIn => scaleOut', [
    style({ opacity: 1, transform: 'scale(1)' }),
    animate('400ms ease-in-out')
]);
export var scaleIn = trigger('scaleIn', [
    scaleEnter
]);
export var scaleOut = trigger('scaleOut', [
    scaleLeave
]);
export var scaleInOut = trigger('scaleInOut', [
    scaleEnter,
    scaleLeave
]);
//# sourceMappingURL=scale.js.map