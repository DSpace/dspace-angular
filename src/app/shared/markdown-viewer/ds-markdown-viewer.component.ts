import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ds-markdown-viewer',
  templateUrl: './ds-markdown-viewer.component.html',
  styleUrls: ['./ds-markdown-viewer.component.scss']
})
export class DsMarkdownViewerComponent implements OnInit {
  @Input() value: string;
  constructor() { }

  ngOnInit(): void {
  }

}
