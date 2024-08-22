import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownViewerComponent } from './markdown-viewer.component';
import { MarkdownDirective } from '../utils/markdown.directive';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
    imports: [CommonModule, MarkdownDirective],
})
export class MarkdownViewerModule { }
