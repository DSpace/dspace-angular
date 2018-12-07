import {
  animate,
  animateChild,
  group,
  query,
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

export const slideHorizontal = trigger('slideHorizontal', [
  state('void', style({ width: 0 })),
  state('*', style({ width: '*' })),
  transition(':enter', [animate('200ms')]),
  transition(':leave', [animate('200ms')])
]);

export const slideMobileNav = trigger('slideMobileNav', [

  state('expanded', style({ height: '100vh' })),

  state('collapsed', style({ height: 0 })),

  transition('expanded <=> collapsed', animate('300ms'))
]);

const collapsedStyle = style({ marginLeft: '-{{ sidebarWidth }}' });
const expandedStyle = style({ marginLeft: '0' });
const options = { params: { sidebarWidth: '*' } };

export const slideSidebar = trigger('slideSidebar', [

  transition('expanded => collapsed',
    group
    (
      [
        query('@*', animateChild()),
        query('.sidebar-collapsible', expandedStyle, options),
        query('.sidebar-collapsible', animate('300ms ease-in-out', collapsedStyle))
      ],
    )),

  transition('collapsed => expanded',
    group
    (
      [
        query('@*', animateChild()),
        query('.sidebar-collapsible', collapsedStyle),
        query('.sidebar-collapsible', animate('300ms ease-in-out', expandedStyle), options)
      ]
    ))
]);

export const slideSidebarMargin = trigger('slideSidebarMargin', [
  state('collapsed', style({ marginLeft: 0 })),
  state('expanded', style({ marginLeft: '{{ collapsedSidebarWidth }}' }), { params: { collapsedSidebarWidth: '*' } }),
  transition('collapsed <=> expanded', [animate('200ms')]),
]);