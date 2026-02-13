import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Site } from '@dspace/core/shared/site.model';
import {
  combineLatest,
  map,
  Observable,
  take,
} from 'rxjs';
import { MarkdownViewerComponent } from 'src/app/shared/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'ds-base-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    AsyncPipe,
    MarkdownViewerComponent,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent implements OnInit {

  homeNewsMetadataValue$: Observable<string>;

  constructor(
    protected route: ActivatedRoute,
    private locale: LocaleService,
  ) {}

  ngOnInit() {
    this.homeNewsMetadataValue$ = combineLatest({
      site$: this.route.data.pipe(
        map((data) => data.site as Site),
      ),
      language$: this.locale.getCurrentLanguageCode(),
    }).pipe(
      take(1),
      map(({ site$, language$ }) => site$?.firstMetadataValue('cris.cms.home-news', { language: language$ })),
    );
  }

}
