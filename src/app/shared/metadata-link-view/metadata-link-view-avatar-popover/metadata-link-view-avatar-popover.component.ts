import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
export class MetadataLinkViewAvatarPopoverComponent extends ThumbnailComponent {

  /**
   * The fallback image to use when the thumbnail is not available
   */
  fallbackImage = 'assets/images/person-placeholder.svg';
}
