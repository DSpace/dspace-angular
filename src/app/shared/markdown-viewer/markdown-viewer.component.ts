import {
  Component,
  Input,
} from '@angular/core';

import { MarkdownDirective } from '../utils/markdown.directive';

@Component({
  selector: 'ds-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss'],
  standalone: true,
  imports: [MarkdownDirective],
})
export class MarkdownViewerComponent {
  @Input() value: string;
}
