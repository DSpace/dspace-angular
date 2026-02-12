import { Component } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { MarkdownViewerComponent } from 'src/app/shared/markdown-viewer/markdown-viewer.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-themed-home-news',
  // styleUrls: ['./home-news.component.scss'],
  styleUrls: ['../../../../../app/home-page/home-news/home-news.component.scss'],
  // templateUrl: './home-news.component.html'
  templateUrl: '../../../../../app/home-page/home-news/home-news.component.html',
  imports: [
    MarkdownViewerComponent,
    AsyncPipe
  ]
})
export class HomeNewsComponent extends BaseComponent {
}
