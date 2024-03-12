import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
  of,
} from 'rxjs';

import { NotifyInfoService } from './notify-info.service';

@Component({
  selector: 'ds-notify-info',
  templateUrl: './notify-info.component.html',
  styleUrls: ['./notify-info.component.scss'],
  imports: [
    RouterLink,
    TranslateModule,
    AsyncPipe,
  ],
  standalone: true,
})
/**
 * Component for displaying COAR notification information.
 */
export class NotifyInfoComponent implements OnInit {
  /**
   * Observable containing the COAR REST INBOX API URLs.
   */
  coarRestApiUrl: Observable<string[]> = of([]);

  constructor(private notifyInfoService: NotifyInfoService) {}

  ngOnInit() {
    this.coarRestApiUrl = this.notifyInfoService.getCoarLdnLocalInboxUrls();
  }

  /**
   * Generates HTML code for COAR REST API links.
   * @returns An Observable that emits the generated HTML code.
   */
  generateCoarRestApiLinksHTML() {
    return this.coarRestApiUrl.pipe(
      // transform the data into HTML
      map((urls) => {
        return urls.map(url => `
          <code><a href="${url}" target="_blank"><span class="api-url">${url}</span></a></code>
        `).join(',');
      }),
    );
  }
}
