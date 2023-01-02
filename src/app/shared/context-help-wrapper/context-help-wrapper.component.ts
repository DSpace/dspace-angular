import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlacementDir } from './placement-dir.model';

/*
 * This component renders an info icon next to the wrapped element which
 * produces a tooltip when clicked.
 */
@Component({
  selector: 'ds-context-help-wrapper',
  templateUrl: './context-help-wrapper.component.html',
  styleUrls: ['./context-help-wrapper.component.scss'],
})
export class ContextHelpWrapperComponent {
  /*
   * Template reference for the wrapped element.
   */
  @Input() templateRef: TemplateRef<any>;

  /*
   * Indicate where the tooltip should show up, relative to the info icon.
   */
  @Input() tooltipPlacement?: PlacementArray;

  /*
   * Indicate whether the info icon should appear to the left or to
   * the right of the wrapped element.
   */
  @Input() iconPlacement?: PlacementDir;

  /*
   * If true, don't process text to render links.
   */
  @Input() dontParseLinks?: boolean;

  // TODO: dependent on evaluation order of input setters?
  parsedContent$: Observable<(string | {href: string, text: string})[]> = observableOf([]);
  @Input() set content(content : string) {
    this.parsedContent$ = this.translateService.get(content).pipe(
      map(this.dontParseLinks
        ? ((text: string) => [text])
        : this.parseLinks)
    );
  }

  constructor(private translateService: TranslateService) { }

  /*
   * Parses Markdown-style links, splitting up a given text
   * into link-free pieces of text and objects of the form
   * {href: string, text: string} (which represent links).
   * This function makes no effort to check whether the href is a
   * correct URL. Currently, this function does not support escape
   * characters: its behavior when given a string containing square
   * brackets that do not deliminate a link is undefined.
   * Regular parentheses outside of links do work, however.
   *
   * For example:
   * parseLinks("This is text, [this](https://google.com) is a link, and [so is this](https://youtube.com)")
   * =
   * [ "This is text, ",
   *   {href: "https://google.com", text: "this"},
   *   " is a link, and ",
   *   {href: "https://youtube.com", text: "so is this"}
   * ]
   */
  private parseLinks(content: string): (string | {href: string, text: string})[] {
    // Implementation note: due to unavailability of `matchAll` method on strings,
    // separate "split" and "parse" steps are needed.

    // We use splitRegexp (the outer `match` call) to split the text
    // into link-free pieces of text (matched by /[^\[]+/) and pieces
    // of text of the form "[some link text](some.link.here)" (matched
    // by /\[([^\]]*)\]\(([^\)]*)\)/)
    const splitRegexp = /[^\[]+|\[([^\]]*)\]\(([^\)]*)\)/g;

    // Once the array is split up in link-representing strings and
    // non-link-representing strings, we use parseRegexp (the inner
    // `match` call) to transform the link-representing strings into
    // {href: string, text: string} objects.
    const parseRegexp = /^\[([^\]]*)\]\(([^\)]*)\)$/;

    return content.match(splitRegexp).map((substring: string) => {
      const match = substring.match(parseRegexp);
      return match === null
        ? substring
        : ({href: match[2], text: match[1]});
    });
  }
}



