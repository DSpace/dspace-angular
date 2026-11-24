import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CanActivateFn } from '@angular/router';

/**
 * Prevents a route from being activated (and therefore its component, resolvers and children from being
 * rendered) during server side rendering, while still allowing it to be activated in the browser.
 */
export const clientOnlyGuard: CanActivateFn = (): boolean => {
  return isPlatformBrowser(inject(PLATFORM_ID));
};
