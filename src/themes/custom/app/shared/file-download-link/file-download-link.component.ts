import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadLinkComponent as BaseComponent } from '../../../../../app/shared/file-download-link/file-download-link.component';

@Component({
  selector: 'ds-themed-file-download-link',
  // templateUrl: './file-download-link.component.html',
  templateUrl: '../../../../../app/shared/file-download-link/file-download-link.component.html',
  // styleUrls: ['./file-download-link.component.scss'],
  styleUrls: ['../../../../../app/shared/file-download-link/file-download-link.component.scss'],
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, NgTemplateOutlet, AsyncPipe, TranslateModule],
})
export class FileDownloadLinkComponent extends BaseComponent {
}
