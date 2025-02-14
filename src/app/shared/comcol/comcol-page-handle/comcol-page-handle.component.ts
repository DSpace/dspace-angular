import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component builds a URL from the value of "handle"
 */

@Component({
  selector: 'ds-base-comcol-page-handle',
  styleUrls: ['./comcol-page-handle.component.scss'],
  templateUrl: './comcol-page-handle.component.html',
  imports: [
    NgIf,
    TranslateModule,
  ],
  standalone: true,
})
export class ComcolPageHandleComponent {

  // Optional title
  @Input() title: string;

  // The value of "handle"
  @Input() content: string;

  public getHandle(): string {
    return this.content;
  }
}
