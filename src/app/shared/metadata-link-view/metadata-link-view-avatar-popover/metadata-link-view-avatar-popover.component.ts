import { Component } from '@angular/core';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';

@Component({
  selector: 'ds-metadata-link-view-avatar-popover',
  templateUrl: './metadata-link-view-avatar-popover.component.html',
  styleUrls: ['./metadata-link-view-avatar-popover.component.scss']
})
export class MetadataLinkViewAvatarPopoverComponent extends ThumbnailComponent {

  fallbackImage = 'assets/images/person-placeholder.svg';
}
