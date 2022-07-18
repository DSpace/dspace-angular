import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsMarkdownViewerComponent } from './ds-markdown-viewer.component';
import { NuMarkdownModule } from '@ng-util/markdown';

@NgModule({
  declarations: [ DsMarkdownViewerComponent ],
  exports: [ DsMarkdownViewerComponent ],
  imports: [ CommonModule, NuMarkdownModule ]
})
export class DsMarkdownViewerModule { }
