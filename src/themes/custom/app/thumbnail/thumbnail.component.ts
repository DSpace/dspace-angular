import { Component } from '@angular/core';
import { ThumbnailComponent as BaseComponent } from '../../../../app/thumbnail/thumbnail.component';

@Component({
  selector: 'ds-thumbnail',
  // styleUrls: ['./thumbnail.component.scss'],
  styleUrls: ['../../../../app/thumbnail/thumbnail.component.scss'],
  // templateUrl: './thumbnail.component.html',
  templateUrl: '../../../../app/thumbnail/thumbnail.component.html',
})
export class ThumbnailComponent extends BaseComponent {
}
