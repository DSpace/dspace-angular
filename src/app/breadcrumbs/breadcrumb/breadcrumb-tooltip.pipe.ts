import { Pipe, PipeTransform } from '@angular/core';
import { TruncateBreadcrumbItemCharactersPipe } from './truncate-breadcrumb-item-characters.pipe';

@Pipe({
  name: 'dsBreadcrumbTooltip',
})
export class BreadcrumbTooltipPipe extends TruncateBreadcrumbItemCharactersPipe implements PipeTransform {

  /**
   * @param text Translated text that should be truncated
   * @returns {string} The full text if the text can be truncated by the {@link TruncateBreadcrumbItemCharactersPipe},
   * null otherwise
   */
  transform(text: string): string | null {
    if (this.isTruncatable(text)) {
      return text;
    }
    return null;
  }

}
