import { Component, Input, OnChanges } from '@angular/core';
import { Bitstream } from '../core/shared/bitstream.model';
import { hasValue } from '../shared/empty.util';
import { RemoteData } from '../core/data/remote-data';

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
export class ThumbnailComponent implements OnChanges {
  /**
   * The thumbnail Bitstream
   */
  @Input() thumbnail: Bitstream | RemoteData<Bitstream>;

  /**
   * The default image, used if the thumbnail isn't set or can't be downloaded.
   * If defaultImage is null, a HTML placeholder is used instead.
   */
  @Input() defaultImage? = null;

  /**
   * The src attribute used in the template to render the image.
   */
  src: string = null;

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

  isLoading: boolean;

  /**
   * Resolve the thumbnail.
   * Use a default image if no actual image is available.
   */
  ngOnChanges(): void {
    if (this.thumbnail === undefined || this.thumbnail === null) {
      return;
    }
    if (this.thumbnail instanceof Bitstream) {
      this.resolveThumbnail(this.thumbnail as Bitstream);
    } else {
      const thumbnailRD = this.thumbnail as RemoteData<Bitstream>;
      if (thumbnailRD.isLoading) {
        this.isLoading = true;
      } else {
        this.resolveThumbnail(thumbnailRD.payload as Bitstream);
      }
    }
  }

  private resolveThumbnail(thumbnail: Bitstream): void {
    if (hasValue(thumbnail) && hasValue(thumbnail._links)
                            && hasValue(thumbnail._links.content)
                            && thumbnail._links.content.href) {
      this.src = thumbnail._links.content.href;
    } else {
      this.src = this.defaultImage;
    }
    this.isLoading = false;
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
