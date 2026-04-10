import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { PageNotFoundComponent as BaseComponent } from '../../../../app/pagenotfound/pagenotfound.component';

@Component({
  selector: 'ds-themed-pagenotfound',
  styleUrls: ['./pagenotfound.component.scss'],
  templateUrl: './pagenotfound.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class PageNotFoundComponent extends BaseComponent implements OnInit {

  private readonly titleService = inject(Title);
  private readonly translateService = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  override ngOnInit(): void {
    super.ngOnInit();
    if (isPlatformBrowser(this.platformId)) {
      this.translateService.get('404.page-not-found')
        .pipe(take(1))
        .subscribe((t: string) => {
          this.titleService.setTitle(t);
        });
    }
  }
}
