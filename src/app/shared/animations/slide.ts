import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slide = trigger('slide', [
  state('expanded', style({ height: '*' })),
  state('collapsed', style({ height: 0 })),
  state('void', style({ height: 0 })),
  state('*', style({ height: '*' })),
  transition(':enter', [animate('200ms')]),
  transition(':leave', [animate('200ms')]),
  transition('expanded <=> collapsed', animate(250)),
]);

export const slideMobileNav = trigger('slideMobileNav', [

  state('expanded', style({ height: '*', minHeight: '*' })),

  state('collapsed', style({ height: 0, minHeight: 0 })),

  transition('expanded <=> collapsed', animate('300ms')),
]);

const collapsedSidebarStyle = style({ maxWidth: '{{collapsedWidth}}' });
const expandedSidebarStyle = style({ maxWidth: '{{expandedWidth}}' });
const unpinnedSidebarPageStyle = style({ paddingLeft: '{{collapsedWidth}}' });
const pinnedSidebarPageStyle = style({ paddingLeft: '{{expandedWidth}}' });
const hiddenSidebarPageStyle = style({ paddingLeft: '0' });
const options = { params: { collapsedWidth: '*', expandedWidth: '*' } };
const animation = '300ms ease-in-out';

export const slideSidebar = trigger('slideSidebar', [
  state('collapsed', collapsedSidebarStyle, options),
  state('expanded', expandedSidebarStyle, options),
  transition('expanded => collapsed', animate(animation, collapsedSidebarStyle)),
  transition('collapsed => expanded', animate(animation, expandedSidebarStyle)),
]);

export const slideSidebarPadding = trigger('slideSidebarPadding', [
  state('hidden', hiddenSidebarPageStyle),
  state('unpinned', unpinnedSidebarPageStyle, options),
  state('pinned', pinnedSidebarPageStyle, options),
  transition('hidden <=> unpinned', animate(animation)),
  transition('hidden <=> pinned', animate(animation)),
  transition('unpinned <=> pinned', animate(animation)),
]);

export const expandSearchInput = trigger('toggleAnimation', [
  state('collapsed', style({
    width: '0',
    opacity: '0',
  })),
  state('expanded', style({
    width: '250px',
    opacity: '1',
  })),
  transition('* => collapsed', group([
    animate('300ms ease-in-out', style({
      width: '30px',
    })),
    animate('300ms ease-in', style({
      opacity: '0',
    })),
  ])),
  transition('* => expanded', group([
    animate('300ms ease-out', style({
      opacity: '1',
    })),
    animate('300ms ease-in-out', style({
      width: '250px',
    })),
  ])),
]);
