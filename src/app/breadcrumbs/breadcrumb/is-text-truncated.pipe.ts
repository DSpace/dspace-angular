import { Pipe, PipeTransform } from '@angular/core';
import { hasValue } from '../../shared/empty.util';

@Pipe({
  name: 'dsIsTextTruncated',
})
export class IsTextTruncatedPipe implements PipeTransform {

  /**
   * @param truncatedText Translated truncated text (text after TruncateBreadcrumbItemCharactersPipe transform)
   * @param fullText Full translated text
   * @returns {string} The full text if the truncated text contains an ellipses, otherwise an empty string.
   * In case an empty string is returned the tooltip will not be shown.
   */
  transform(truncatedText: string, fullText: string): string {
    if (hasValue(truncatedText) && truncatedText.includes('...')) {
      return fullText;
    } else {
      return '';
    }
  }
}
