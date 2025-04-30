import { Component, Input, OnInit } from '@angular/core';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';

@Component({
  selector: 'ds-metadata-link-view-avatar-popover',
  templateUrl: './metadata-link-view-avatar-popover.component.html',
  styleUrls: ['./metadata-link-view-avatar-popover.component.scss']
})
export class MetadataLinkViewAvatarPopoverComponent extends ThumbnailComponent implements OnInit {

  /**
   * The fallback image to use when the thumbnail is not available
   */
  fallbackImageUrl = 'assets/images/replacement_image.svg';

  /**
   * Placeholder image url that changes based on entity type
   */
  placeholderImageUrl: string;

  /**
   * The entity type of the item which the avatar belong
   */
  @Input() entityType: string;

  ngOnInit() {
    this.placeholderImageUrl = this.entityType ? `assets/images/${this.entityType.toLowerCase()}-placeholder.svg` : this.fallbackImageUrl;
  }

  /**
   * Handle error loading image placeholder, e.g. missing placeholder image for specific entity type.
   * @param event
   */
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImageUrl;
  }

  /**
   * set loading to true to prevent glitch of img with null src
   */
  errorHandler() {
    this.isLoading = true;
    super.errorHandler();
  }
}
