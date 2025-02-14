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
} from 'rxjs';

import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';

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
  coarRestApiUrls$: Observable<string>;

  constructor(
    protected notifyInfoService: NotifyInfoService,
  ) {
  }

  ngOnInit() {
    this.coarRestApiUrls$ = this.notifyInfoService.getCoarLdnLocalInboxUrls().pipe(
      map((urls: string[]) => urls.map((url: string) => `<a href="${url}" target="_blank">${url}</a>`).join(', ')),
    );
  }

}
