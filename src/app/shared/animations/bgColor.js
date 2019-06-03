import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
var startStyle = style({ backgroundColor: '{{ startColor }}' });
var endStyle = style({ backgroundColor: '{{ endColor }}' });
export var bgColor = trigger('bgColor', [
    state('startBackground', startStyle, { params: { startColor: '*' } }),
    state('endBackground', endStyle, { params: { endColor: '*' } }),
    transition('startBackground <=> endBackground', group([
        query('@*', animateChild()),
        animate('200ms'),
    ]))
]);
//# sourceMappingURL=bgColor.js.map