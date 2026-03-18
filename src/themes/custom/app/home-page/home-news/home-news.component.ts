import { Component } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

@Component({
  selector: 'ds-themed-home-news',
  // styleUrls: ['./home-news.component.scss'],
  styleUrls: ['home-news.component.scss'],
  // templateUrl: './home-news.component.html'
  templateUrl: 'home-news.component.html',
})
export class HomeNewsComponent extends BaseComponent {
}
