import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownViewerComponent } from './markdown-viewer.component';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
  imports: [ CommonModule ],
})
export class MarkdownViewerModule { }
