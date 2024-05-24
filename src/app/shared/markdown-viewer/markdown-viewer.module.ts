import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NuMarkdownModule } from '@ng-util/markdown';

import { MarkdownViewerComponent } from './markdown-viewer.component';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
  imports: [ CommonModule, NuMarkdownModule ],
})
export class MarkdownViewerModule { }
