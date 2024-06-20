import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe to keep html tags e.g., `id` in the `innerHTML` attribute.
 */
@Pipe({
  name: 'dsSafeHtml'
})
export class ClarinSafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(htmlString: string): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(htmlString);
  }
}
