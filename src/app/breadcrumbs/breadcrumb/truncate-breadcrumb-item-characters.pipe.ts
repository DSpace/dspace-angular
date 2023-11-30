import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { hasValue } from '../../shared/empty.util';

@Pipe({
  name: 'dsTruncateText',
})
export class TruncateBreadcrumbItemCharactersPipe implements PipeTransform {
  /**
   * The maximum number of characters to display in a breadcrumb item
   * @type {number}
   */
  readonly charLimit: number = environment.breadcrumbCharLimit;

  /**
   * Truncates the text based on the configured char number allowed per breadcrumb element.
   * If text is shorter than the number of chars allowed, it will return the text as it is.
   * If text is longer than the number of chars allowed, it will return the text truncated with an ellipsis at the end.
   * @param text Traslated text to be truncated
   */
  transform(text: string): string {
    if (this.isTruncatable(text)) {
      return text.substring(0, this.charLimit).concat('...');
    } else {
      return text;
    }
  }

  protected isTruncatable(text: string): boolean {
    return hasValue(text) && text.length > this.charLimit;
  }
}
