import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownViewerModule } from '../markdown-viewer/markdown-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    MarkdownViewerModule,
  ],
})
export class ExploreModule {
}
