import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { SectionComponent } from '../core/layout/models/section.model';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;

  sectionId = 'site';

  /**
   * Resolved section components splitted in rows.
   */
  sectionComponentRows: Observable<SectionComponent[][]>;

  constructor(
    private route: ActivatedRoute,
    private sectionDataService: SectionDataService
  ) {
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
    this.sectionComponentRows = this.sectionDataService.findById('site').pipe(
      getFirstSucceededRemoteDataPayload(),
      map ( (section) => section.componentRows)
    );
  }

}
