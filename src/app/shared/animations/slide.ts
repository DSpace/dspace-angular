import {
  animate,
  animateChild,
  group, query, sequence,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const slide = trigger('slide', [
  state('void', style({ height: 0 })),
  state('*', style({ height: '*' })),
  transition(':enter', [animate('200ms')]),
  transition(':leave', [animate('200ms')])
]);

export const slideMobileNav = trigger('slideMobileNav', [

  state('expanded', style({ height: '100vh' })),

  state('collapsed', style({ height: 0 })),

  transition('expanded <=> collapsed', animate('300ms'))
]);

export const slideSidebar = trigger('slideSidebar', [

  state('expanded',
    style({ width: '{{ sidebarWidth }}' }),
    { params: { sidebarWidth: '*' } }
  ),

  state('collapsed', style({ width: '*' })),

  transition('expanded <=> collapsed',

    group
    (
      [
        query('@*', animateChild()),
        animate('300ms ease-in-out'),

      ]
    ))
]);
