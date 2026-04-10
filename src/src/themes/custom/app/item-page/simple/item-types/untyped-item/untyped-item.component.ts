import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BreadcrumbsService } from '../../../../../../../app/breadcrumbs/breadcrumbs.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import { CollectionsComponent } from '../../../../../../../app/item-page/field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../../../../../app/item-page/media-viewer/themed-media-viewer.component';
import { ThemedFileSectionComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/themed-file-section.component';
import { UntypedItemComponent as BaseComponent } from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { DsoEditMenuComponent } from '../../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import { CitationComponent } from '../../citation/citation.component';

@listableObjectComponent(Item, ViewMode.StandalonePage, undefined, 'custom')
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CitationComponent,
    CollectionsComponent,
    DsoEditMenuComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedMediaViewerComponent,
    ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class UntypedItemComponent extends BaseComponent implements OnInit {
  private readonly breadcrumbsService = inject(BreadcrumbsService);
  readonly breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
  shareOpen = false;

  override ngOnInit(): void {
    super.ngOnInit();
    this.breadcrumbsService.showBreadcrumbs$.next(false);
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  openShare(platform: string): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=450,noopener,noreferrer');
  }
}
