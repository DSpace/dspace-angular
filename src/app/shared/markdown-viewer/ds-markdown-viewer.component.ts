import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-markdown-viewer',
  templateUrl: './ds-markdown-viewer.component.html',
  styleUrls: ['./ds-markdown-viewer.component.scss']
})
export class DsMarkdownViewerComponent {
  @Input() value: string;
}
