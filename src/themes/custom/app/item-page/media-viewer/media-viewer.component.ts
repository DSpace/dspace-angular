import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MediaViewerComponent as BaseComponent } from '../../../../../app/item-page/media-viewer/media-viewer.component';
import { ThemedMediaViewerImageComponent } from '../../../../../app/item-page/media-viewer/media-viewer-image/themed-media-viewer-image.component';
import { ThemedMediaViewerVideoComponent } from '../../../../../app/item-page/media-viewer/media-viewer-video/themed-media-viewer-video.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-themed-media-viewer',
  // templateUrl: './media-viewer.component.html',
  templateUrl: '../../../../../app/item-page/media-viewer/media-viewer.component.html',
  // styleUrls: ['./media-viewer.component.scss'],
  styleUrls: ['../../../../../app/item-page/media-viewer/media-viewer.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    ThemedLoadingComponent,
    ThemedMediaViewerImageComponent,
    ThemedMediaViewerVideoComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class MediaViewerComponent extends BaseComponent {
}
