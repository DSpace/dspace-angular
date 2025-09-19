import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { Community } from '@dspace/core/shared/community.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedThumbnailComponent } from '../../../thumbnail/themed-thumbnail.component';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

/**
 * Component representing a grid element for a community
 */
@Component({
  selector: 'ds-community-grid-element',
  styleUrls: ['./community-grid-element.component.scss'],
  templateUrl: './community-grid-element.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})

@listableObjectComponent(Community, ViewMode.GridElement)
export class CommunityGridElementComponent extends AbstractListableElementComponent<Community> {
  private _object: Community;

  constructor(
    public dsoNameService: DSONameService,
    private linkService: LinkService,
  ) {
    super(dsoNameService);
  }

  // @ts-ignore
  @Input() set object(object: Community) {
    this._object = object;
    if (hasValue(this._object) && hasNoValue(this._object.logo)) {
      this.linkService.resolveLink<Community>(this._object, followLink('logo'));
    }
  }

  get object(): Community {
    return this._object;
  }
}
