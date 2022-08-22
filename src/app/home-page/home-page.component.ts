import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { SectionComponent, TextRowSection } from '../core/layout/models/section.model';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';
import { SiteDataService } from '../core/data/site-data.service';
import { LocaleService } from '../core/locale/locale.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: BehaviorSubject<Site> = new BehaviorSubject<Site>(null);

  sectionId = 'site';

  /**
   * Resolved section components splitted in rows.
   */
  sectionComponentRows: Observable<SectionComponent[][]>;

  hasHomeHeaderMetadata: boolean;

  homeHeaderSection: TextRowSection = {
    content: 'cris.cms.home-header',
    contentType: 'text-metadata',
    componentType: 'text-row',
    style: ''
  };

  constructor(
    private route: ActivatedRoute,
    private sectionDataService: SectionDataService,
    private siteService: SiteDataService,
    private locale: LocaleService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.site as Site),
      take(1)
    ).subscribe((site: Site) => {
      this.site$.next(site);
    });

    this.sectionComponentRows = this.sectionDataService.findById('site').pipe(
      getFirstSucceededRemoteDataPayload(),
      map ( (section) => section.componentRows)
    );
    this.siteService.find().pipe(take(1)).subscribe(
      (site: Site) => {
        this.hasHomeHeaderMetadata = !isEmpty(site.firstMetadataValue('cris.cms.home-header',
          { language: this.locale.getCurrentLanguageCode() }));
      }
    );
  }

}
