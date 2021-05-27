import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../core/shared/bitstream.model';
import { hasValue } from '../shared/empty.util';

/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, a HTML placeholder will be rendered instead.
 */
@Component({
  selector: 'ds-thumbnail',
  styleUrls: ['./thumbnail.component.scss'],
  templateUrl: './thumbnail.component.html',
})
export class ThumbnailComponent implements OnInit {
  /**
   * The thumbnail Bitstream
   */
  @Input() thumbnail: Bitstream;

  /**
   * The default image, used if the thumbnail isn't set or can't be downloaded.
   * If defaultImage is null, a HTML placeholder is used instead.
   */
  @Input() defaultImage? = null;

  /**
   * The src attribute used in the template to render the image.
   */
  src: string;

  /**
   * i18n key of thumbnail alt text
   */
  @Input() alt? = 'thumbnail.default.alt';

  /**
   * i18n key of HTML placeholder text
   */
  @Input() placeholder? = 'thumbnail.default.placeholder';

  /**
   * Limit thumbnail width to --ds-thumbnail-max-width
   */
  @Input() limitWidth? = true;

  /**
   * Initialize the thumbnail.
   * Use a default image if no actual image is available.
   */
  ngOnInit(): void {
    if (hasValue(this.thumbnail) && hasValue(this.thumbnail._links)
                                 && hasValue(this.thumbnail._links.content)
                                 && this.thumbnail._links.content.href) {
      this.src = this.thumbnail._links.content.href;
    } else {
      this.src = this.defaultImage;
    }
  }

  /**
   * Handle image download errors.
   * If the image can't be found, use the defaultImage instead.
   * If that also can't be found, use null to fall back to the HTML placeholder.
   */
  errorHandler() {
    if (this.src !== this.defaultImage) {
      this.src = this.defaultImage;
    } else {
      this.src = null;
    }
  }
}
