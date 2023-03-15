import { Component } from '@angular/core';
import { ThumbnailComponent as BaseComponent } from '../../../../app/thumbnail/thumbnail.component';

/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, an HTML placeholder will be rendered instead.
 */
@Component({
  selector: 'ds-thumbnail',
  styleUrls: ['./thumbnail.component.scss'],
  templateUrl: './thumbnail.component.html',
})
export class ThumbnailComponent extends BaseComponent {

}
