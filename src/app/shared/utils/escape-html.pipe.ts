import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';

@Pipe({
  name: 'dsEscapeHtml',
})
export class EscapeHtmlPipe implements PipeTransform {
  /**
   * Tags allowed to remain as HTML only when they are well-formed (have both opening and closing tags in order).
   *  <br> self-closing tags are NOT whitelisted here and will be escaped by default.
   */
  private readonly allowedTags: string[] = ['em', 'strong'];

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Escape HTML special characters and convert newlines to <br>
   * Then selectively unescape allowed tags only if they have both opening and closing tags.
   *
   * Examples:
   * - "<em>Lorem</em>" retains the <em> tag
   * - "<em>Lorem</strong>" escapes both tags
   * - "<em>Lorem <strong>ipsum</strong>" escapes the unclosed <em> while retaining the valid <strong>
   */
  transform(text: string): SafeHtml {
    if (text == null) {
      return '';
    }

    let processed = text;

    // Step 1: Protect well-formed whitelisted tag pairs by replacing them with placeholders
    for (const tag of this.allowedTags) {
      const openRaw = `<${tag}>`;
      const closeRaw = `</${tag}>`;
      const openEsc = `&lt;${tag}&gt;`;
      const closeEsc = `&lt;/${tag}&gt;`;

      const placeholderOpen = `__DS_ALLOWED_OPEN_${tag.toUpperCase()}__`;
      const placeholderClose = `__DS_ALLOWED_CLOSE_${tag.toUpperCase()}__`;

      // Raw HTML pair: <tag>... </tag>
      const rawPattern = new RegExp(`${openRaw}(.*?)${closeRaw}`, 'gis');
      processed = processed.replace(rawPattern, `${placeholderOpen}$1${placeholderClose}`);

      // Escaped HTML pair: &lt;tag&gt;... &lt;/tag&gt;
      const escPattern = new RegExp(`${openEsc}(.*?)${closeEsc}`, 'gis');
      processed = processed.replace(escPattern, `${placeholderOpen}$1${placeholderClose}`);
    }

    // Step 2: Escape all remaining < and > characters
    processed = processed.replace(/>/g, '&gt;').replace(/</g, '&lt;');

    // Step 3: Restore placeholders back to real tags
    for (const tag of this.allowedTags) {
      const placeholderOpen = new RegExp(`__DS_ALLOWED_OPEN_${tag.toUpperCase()}__`, 'g');
      const placeholderClose = new RegExp(`__DS_ALLOWED_CLOSE_${tag.toUpperCase()}__`, 'g');
      processed = processed.replace(placeholderOpen, `<${tag}>`).replace(placeholderClose, `</${tag}>`);
    }

    // Step 4: Convert newlines to <br>
    processed = processed.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(processed);
  }

}
