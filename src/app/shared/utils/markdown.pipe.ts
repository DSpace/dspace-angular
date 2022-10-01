import { Inject, InjectionToken, Pipe, PipeTransform } from '@angular/core';
import MarkdownIt from 'markdown-it';
import * as sanitizeHtml from 'sanitize-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

const mathjaxLoader = async () => (await import('markdown-it-mathjax3')).default;
type Mathjax = ReturnType<typeof mathjaxLoader>;
const MATHJAX = new InjectionToken<Mathjax>(
  'Lazily loaded mathjax',
  { providedIn: 'root', factory: mathjaxLoader }
);

/**
 * Pipe for rendering markdown and mathjax.
 * - markdown will only be rendered if {@link MarkdownConfig#enabled} is true
 * - mathjax will only be rendered if both {@link MarkdownConfig#enabled} and {@link MarkdownConfig#mathjax} are true
 *
 * This pipe should be used on the 'innerHTML' attribute of a component, in combination with an async pipe.
 * Example usage:
 *   <span class="example" [innerHTML]="'# title' | dsMarkdown | async"></span>
 * Result:
 *   <span class="example">
 *     <h1>title</h1>
 *   </span>
 */
@Pipe({
  name: 'dsMarkdown'
})
export class MarkdownPipe implements PipeTransform {

  constructor(
    protected sanitizer: DomSanitizer,
    @Inject(MATHJAX) private mathjax: Mathjax,
  ) {
  }

  async transform(value: string): Promise<SafeHtml> {
    if (!environment.markdown.enabled) {
      return value;
    }
    const md = new MarkdownIt({
      html: true,
      linkify: true,
    });
    if (environment.markdown.mathjax) {
      md.use(await this.mathjax);
    }
    return this.sanitizer.bypassSecurityTrustHtml(
      sanitizeHtml(md.render(value), {
        // sanitize-html doesn't let through SVG by default, so we extend its allowlists to cover MathJax SVG
        allowedTags: [
          ...sanitizeHtml.defaults.allowedTags,
          'mjx-container', 'svg', 'g', 'path', 'rect', 'text'
        ],
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'mjx-container': [
            'class', 'style', 'jax'
          ],
          svg: [
            'xmlns', 'viewBox', 'style', 'width', 'height', 'role', 'focusable', 'alt', 'aria-label'
          ],
          g: [
            'data-mml-node', 'style', 'stroke', 'fill', 'stroke-width', 'transform'
          ],
          path: [
            'd', 'style', 'transform'
          ],
          rect: [
            'width', 'height', 'x', 'y', 'transform', 'style'
          ],
          text: [
            'transform', 'font-size'
          ]
        },
        parser: {
          lowerCaseAttributeNames: false,
        },
      })
    );
  }
}
