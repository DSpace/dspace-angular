import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownViewerComponent } from './markdown-viewer.component';
import { NuMarkdownModule } from '@ng-util/markdown';

@NgModule({
  declarations: [ MarkdownViewerComponent ],
  exports: [ MarkdownViewerComponent ],
  imports: [ CommonModule, NuMarkdownModule ]
})
export class MarkdownViewerModule { }
