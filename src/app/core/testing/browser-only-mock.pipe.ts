import {
  Pipe,
  PipeTransform,
} from '@angular/core';

/**
 * Support dsBrowserOnly in unit tests.
 */
@Pipe({
  name: 'dsBrowserOnly',
  standalone: true,
})
export class BrowserOnlyMockPipe implements PipeTransform {
  transform(value: string): string | undefined {
    return value;
  }
}
