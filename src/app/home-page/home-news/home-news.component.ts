import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { SiteDataService } from '../../core/data/site-data.service';
import { TextRowSection } from '../../core/layout/models/section.model';
import { SectionDataService } from '../../core/layout/section-data.service';
import { LocaleService } from '../../core/locale/locale.service';
import { Site } from '../../core/shared/site.model';
import { isEmpty } from '../../shared/empty.util';
import { ThemedTextSectionComponent } from '../../shared/explore/section-component/text-section/themed-text-section.component';

@Component({
  selector: 'ds-base-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  standalone: true,
  imports: [
    ThemedTextSectionComponent,
    AsyncPipe,
    NgIf,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent implements OnInit {

  site$: Observable<Site>;

  hasHomeNewsMetadata: boolean;

  homeNewsSection: TextRowSection = {
    content: 'cris.cms.home-news',
    contentType: 'text-metadata',
    componentType: 'text-row',
    style: '',
  };

  constructor(
    private route: ActivatedRoute,
    private sectionDataService: SectionDataService,
    private siteService: SiteDataService,
    private locale: LocaleService,
  ) {
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
    this.siteService.find().pipe(take(1)).subscribe(
      (site: Site) => {
        this.hasHomeNewsMetadata = !isEmpty(site?.firstMetadataValue('cris.cms.home-news',
          { language: this.locale.getCurrentLanguageCode() }));
      },
    );
  }

}
