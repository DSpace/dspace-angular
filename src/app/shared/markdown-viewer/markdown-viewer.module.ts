import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';

import { MarkdownViewerComponent } from './markdown-viewer.component';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
  imports: [ CommonModule, SharedModule ],
})
export class MarkdownViewerModule { }
