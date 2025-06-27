import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';

import { getDefaultImageUrlByEntityType } from '../../../core/shared/image.utils';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { SafeUrlPipe } from '../../utils/safe-url-pipe';

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
  ],
  standalone: true,
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
