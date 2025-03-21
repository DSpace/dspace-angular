
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component renders any content inside of this component.
 * If there is a title set it will render the title.
 * If hasInnerHtml is true the content will be handled as html.
 * To see how it is used see collection-page or community-page.
 */
@Component({
  selector: 'ds-base-comcol-page-content',
  styleUrls: ['./comcol-page-content.component.scss'],
  templateUrl: './comcol-page-content.component.html',
  imports: [
    TranslateModule,
  ],
  standalone: true,
})
export class ComcolPageContentComponent {

  /**
   * Optional title
   */
  @Input() title: string;

  /**
   * The content to render. Might be html
   */
  @Input() content: string;

  /**
   * flag whether the content contains html syntax or not
   */
  @Input() hasInnerHtml: boolean;

}
