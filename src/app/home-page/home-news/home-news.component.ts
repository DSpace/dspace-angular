import { Component, OnInit, } from '@angular/core';
import { Observable } from 'rxjs';
import { Site } from '../../core/shared/site.model';
import { TextRowSection } from '../../core/layout/models/section.model';
import { ActivatedRoute } from '@angular/router';
import { SectionDataService } from '../../core/layout/section-data.service';
import { SiteDataService } from '../../core/data/site-data.service';
import { LocaleService } from '../../core/locale/locale.service';
import { map, take } from 'rxjs/operators';
import { isEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html'
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
          {language: this.locale.getCurrentLanguageCode()}));
      }
    );
  }

}
