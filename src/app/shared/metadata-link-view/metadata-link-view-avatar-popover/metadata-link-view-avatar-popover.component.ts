import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';

import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { SafeUrlPipe } from '../../utils/safe-url-pipe';
import { VarDirective } from '../../utils/var.directive';

@Component({
  selector: 'ds-metadata-link-view-avatar-popover',
  templateUrl: './metadata-link-view-avatar-popover.component.html',
  styleUrls: ['./metadata-link-view-avatar-popover.component.scss'],
  imports: [
    ThemedLoadingComponent,
    NgIf,
    SafeUrlPipe,
    TranslateModule,
    NgClass,
    AsyncPipe,
    VarDirective,
  ],
  standalone: true,
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
}
