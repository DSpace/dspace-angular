import { Component, Inject, OnInit } from '@angular/core';
import { HtmlContentService } from '../shared/html-content.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { isEmpty, isNotEmpty } from '../shared/empty.util';
import { LocaleService } from '../core/locale/locale.service';
import {
  HTML_SUFFIX,
  STATIC_FILES_DEFAULT_ERROR_PAGE_PATH,
  STATIC_FILES_PROJECT_PATH, STATIC_PAGE_PATH
} from './static-page-routing-paths';
import { APP_CONFIG, AppConfig } from '../../config/app-config.interface';

/**
 * Component which load and show static files from the `static-files` folder.
 * E.g., `<UI_URL>/static/test_file.html will load the file content from the `static-files/test_file.html`/
 */
@Component({
  selector: 'ds-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit {
  htmlContent: BehaviorSubject<string> = new BehaviorSubject<string>('');
  htmlFileName: string;

  constructor(private htmlContentService: HtmlContentService,
              private router: Router,
              private localeService: LocaleService,
              @Inject(APP_CONFIG) protected appConfig?: AppConfig) { }

  async ngOnInit(): Promise<void> {
    let url = '';
    // Fetch html file name from the url path. `static/some_file.html`
    this.htmlFileName = this.getHtmlFileName();

    // Get current language
    let language = this.localeService.getCurrentLanguageCode();
    // If language is default = `en` do not load static files from translated package e.g. `cs`.
    language = language === 'en' ? '' : language;

    // Try to find the html file in the translated package. `static-files/language_code/some_file.html`
    // Compose url
    url = STATIC_FILES_PROJECT_PATH;
    url += isEmpty(language) ? '/' + this.htmlFileName : '/' + language + '/' + this.htmlFileName;
    // Add `.html` suffix to get the current html file
    url = url.endsWith(HTML_SUFFIX) ? url : url + HTML_SUFFIX;
    let potentialContent = await firstValueFrom(this.htmlContentService.fetchHtmlContent(url));
    if (isNotEmpty(potentialContent)) {
      this.htmlContent.next(potentialContent);
      return;
    }

    // If the file wasn't find, get the non-translated file from the default package.
    url = STATIC_FILES_PROJECT_PATH + '/' + this.htmlFileName;
    potentialContent = await firstValueFrom(this.htmlContentService.fetchHtmlContent(url));
    if (isNotEmpty(potentialContent)) {
      this.htmlContent.next(potentialContent);
      return;
    }

    // Show error page
    await this.loadErrorPage();
  }

  /**
   * Handle click on links in the static page.
   * @param event
   */
  processLinks(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement.nodeName !== 'A') {
      return;
    }

    event.preventDefault();

    const href = targetElement.getAttribute('href');
    const { nameSpace } = this.appConfig.ui;
    const namespacePrefix = nameSpace === '/' ? '' : nameSpace;

    const redirectUrl = this.composeRedirectUrl(href, namespacePrefix);

    if (this.isFragmentLink(href)) {
      this.redirectToFragment(redirectUrl, href);
    } else if (this.isRelativeLink(href)) {
      this.redirectToRelativeLink(redirectUrl, href);
    } else if (this.isExternalLink(href)) {
      this.redirectToExternalLink(href);
    } else {
      this.redirectToAbsoluteLink(redirectUrl, href, namespacePrefix);
    }
  }

  private composeRedirectUrl(href: string | null, namespacePrefix: string): string {
    const staticPagePath = STATIC_PAGE_PATH;
    const baseUrl = new URL(window.location.origin);
    baseUrl.pathname = `${namespacePrefix}/${staticPagePath}/`;
    return baseUrl.href;
  }

  private isFragmentLink(href: string | null): boolean {
    return href?.startsWith('#') ?? false;
  }

  private redirectToFragment(redirectUrl: string, href: string | null): void {
    window.location.href = `${redirectUrl}${this.htmlFileName}${href}`;
  }

  private isRelativeLink(href: string | null): boolean {
    return href?.startsWith('.') ?? false;
  }

  private redirectToRelativeLink(redirectUrl: string, href: string | null): void {
    window.location.href = new URL(href, redirectUrl).href;
  }

  private isExternalLink(href: string | null): boolean {
    return (href?.startsWith('http') || href?.startsWith('www')) ?? false;
  }

  private redirectToExternalLink(href: string | null): void {
    window.location.replace(href);
  }

  private redirectToAbsoluteLink(redirectUrl: string, href: string | null, namespacePrefix: string): void {
    const absoluteUrl = new URL(href, redirectUrl.replace(namespacePrefix, ''));
    window.location.href = absoluteUrl.href;
  }

  /**
   * Load file name from the URL - `static/FILE_NAME.html`
   * @private
   */
  private getHtmlFileName() {
    let urlInList = this.router.url?.split('/');
    // Filter empty elements
    urlInList = urlInList.filter(n => n);
    // if length is 1 - html file name wasn't defined.
    if (isEmpty(urlInList) || urlInList.length === 1) {
      void this.loadErrorPage();
      return null;
    }

    // If the url is too long take just the first string after `/static` prefix.
    return urlInList[1]?.split('#')?.[0];
  }

  /**
   * Load `static-files/error.html`
   * @private
   */
  private async loadErrorPage() {
    let errorPage = await firstValueFrom(this.htmlContentService.fetchHtmlContent(STATIC_FILES_DEFAULT_ERROR_PAGE_PATH));
    if (isEmpty(errorPage)) {
      console.error('Cannot load error page from the path: ' + STATIC_FILES_DEFAULT_ERROR_PAGE_PATH);
      return;
    }
    this.htmlContent.next(errorPage);
  }
}
