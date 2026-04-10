import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

@Component({
  selector: 'ds-themed-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {
  get syndicationFeedUrl(): string {
    const r = this.appConfig.rest;
    const protocol = r.ssl ? 'https' : 'http';
    const port = (r.ssl && r.port === 443) || (!r.ssl && r.port === 80) ? '' : `:${r.port}`;
    return `${protocol}://${r.host}${port}${r.nameSpace}/opensearch/search?format=atom&query=*`;
  }
}
