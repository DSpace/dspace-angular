import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';

import { getDefaultImageUrlByEntityType } from '../../image.utils';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { SafeUrlPipe } from '../../utils/safe-url-pipe';

/**
 * Component that displays an avatar thumbnail within a popover.
 * This component is used by the MetadataLinkViewComponent to show entity avatars (e.g., person photos,
 * organization logos) in a popover when hovering over or clicking on metadata links.
 *
 * The popover displays:
 * - The entity's thumbnail image if available
 * - A placeholder image based on the entity type if no thumbnail is available
 */
@Component({
  selector: 'ds-metadata-link-view-avatar-popover',
  templateUrl: './metadata-link-view-avatar-popover.component.html',
  styleUrls: ['./metadata-link-view-avatar-popover.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    SafeUrlPipe,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class MetadataLinkViewAvatarPopoverComponent extends ThumbnailComponent implements OnInit {


  /**
   * Placeholder image url that changes based on entity type
   */
  placeholderImageUrl$: Observable<string>;

  /**
   * The entity type of the item which the avatar belong
   */
  @Input() entityType: string;

  ngOnInit() {
    this.placeholderImageUrl$ = getDefaultImageUrlByEntityType(this.entityType);
  }
}
