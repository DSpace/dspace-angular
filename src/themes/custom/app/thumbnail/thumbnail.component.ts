import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { SafeUrlPipe } from '../../../../app/shared/utils/safe-url-pipe';
import { ThumbnailComponent as BaseComponent } from '../../../../app/thumbnail/thumbnail.component';

@Component({
  selector: 'ds-themed-thumbnail',
  // styleUrls: ['./thumbnail.component.scss'],
  styleUrls: ['../../../../app/thumbnail/thumbnail.component.scss'],
  // templateUrl: './thumbnail.component.html',
  templateUrl: '../../../../app/thumbnail/thumbnail.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe,
    ThemedLoadingComponent,
    TranslatePipe,
  ],
})
export class ThumbnailComponent extends BaseComponent {
}
