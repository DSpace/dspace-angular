import { Component, Input } from '@angular/core';

/**
 * This component renders the value of "handle"
 */

@Component({
  selector: 'ds-comcol-page-handle',
  styleUrls: ['./comcol-page-handle.component.scss'],
  templateUrl: './comcol-page-handle.component.html'
})
export class ComcolPageHandleComponent {

  // Optional title
  @Input() title: string;

  // The content to render. Might be html
  @Input() content: string;

}
