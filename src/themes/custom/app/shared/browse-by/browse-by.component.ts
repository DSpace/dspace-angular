import { Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../../../app/shared/animations/fade';
import { BrowseByComponent as BaseComponent } from '../../../../../app/shared/browse-by/browse-by.component';

@Component({
  selector: 'ds-browse-by',
  // styleUrls: ['./browse-by.component.scss'],
  styleUrls: ['../../../../../app/shared/browse-by/browse-by.component.scss'],
  // templateUrl: './browse-by.component.html',
  templateUrl: '../../../../../app/shared/browse-by/browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut,
  ],
})
export class BrowseByComponent extends BaseComponent {
}
