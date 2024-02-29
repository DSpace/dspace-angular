import { Component, OnInit } from '@angular/core';
import { NotifyInfoService } from './notify-info.service';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'ds-notify-info',
  templateUrl: './notify-info.component.html',
  styleUrls: ['./notify-info.component.scss'],
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
      })
    );
  }
}
