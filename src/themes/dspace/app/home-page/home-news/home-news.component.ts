import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { ThemedTextSectionComponent } from '../../../../../app/shared/explore/section-component/text-section/themed-text-section.component';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  standalone: true,
  imports: [
    ThemedTextSectionComponent,
    NgIf,
    AsyncPipe,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {}

