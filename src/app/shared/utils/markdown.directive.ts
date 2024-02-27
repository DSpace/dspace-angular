import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  SecurityContext
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MathService } from '../../core/shared/math.service';
import { isEmpty } from '../empty.util';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const markdownItLoader = async () => (await import('markdown-it')).default;
type LazyMarkdownIt = ReturnType<typeof markdownItLoader>;
const MARKDOWN_IT = new InjectionToken<LazyMarkdownIt>(
  'Lazily loaded MarkdownIt',
  {providedIn: 'root', factory: markdownItLoader}
);

@Directive({
  selector: '[dsMarkdown]'
})
export class MarkdownDirective implements OnInit, OnDestroy {

  @Input() dsMarkdown: string;
  private alive$ = new Subject<boolean>();

  el: HTMLElement;

  constructor(
    protected sanitizer: DomSanitizer,
    @Inject(MARKDOWN_IT) private markdownIt: LazyMarkdownIt,
    private mathService: MathService,
    private elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit() {
    this.render(this.dsMarkdown);
  }

  async render(value: string, forcePreview = false): Promise<SafeHtml> {
    if (isEmpty(value) || (!environment.markdown.enabled && !forcePreview)) {
      this.el.innerHTML = value;
      return;
    } else {
      const MarkdownIt = await this.markdownIt;
      const md = new MarkdownIt({
        html: true,
        linkify: true,
      });

      const html = this.sanitizer.sanitize(SecurityContext.HTML, md.render(value));
      this.el.innerHTML = html;

      if (environment.markdown.mathjax) {
        this.renderMathjax();
      }
    }
  }

  private renderMathjax() {
    this.mathService.ready().pipe(
      take(1),
      takeUntil(this.alive$)
    ).subscribe(() => {
      this.mathService.render(this.el);
    });
  }

  ngOnDestroy() {
    this.alive$.next(false);
  }
}
