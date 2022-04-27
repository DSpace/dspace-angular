import { Inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * A pipe that only returns its intput when run in the browser.
 * Used to distinguish client-side rendered content from server-side rendered content.
 */
@Pipe({
  name: 'dsBrowserOnly'
})
export class BrowserOnlyPipe implements PipeTransform {
  constructor(
    @Inject(PLATFORM_ID) private platformID: any,
  ) {
  }

  transform(value: string): string | undefined {
    if (isPlatformBrowser((this.platformID))) {
      return value;
    } else {
      return undefined;
    }
  }
}
