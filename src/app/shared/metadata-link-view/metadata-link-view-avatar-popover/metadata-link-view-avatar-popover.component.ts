import { Component, Input, OnInit } from '@angular/core';
import { ThumbnailComponent } from 'src/app/thumbnail/thumbnail.component';
import { getDefaultImageUrlByEntityType } from '../../../core/shared/image.utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-metadata-link-view-avatar-popover',
  templateUrl: './metadata-link-view-avatar-popover.component.html',
  styleUrls: ['./metadata-link-view-avatar-popover.component.scss']
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
