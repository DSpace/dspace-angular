import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventType, NavigationEnd, Router, RouterLink, Scroll } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, distinctUntilChanged, filter, map, of, startWith, take } from 'rxjs';

import { getCollectionPageRoute } from '../../../../../../../src/app/collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../../../../../../src/app/community-page/community-page-routing-paths';
import { ComcolPageBrowseByComponent as BaseComponent, ComColPageNavOption } from '../../../../../../../src/app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';
import { isNotEmpty } from '../../../../../../../src/app/shared/empty.util';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  styleUrls: ['../../../../../../../src/app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.scss'],
  templateUrl: '../../../../../../../src/app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
export class ComcolPageBrowseByComponent extends BaseComponent {

  public recent: ComColPageNavOption = {
    id: 'recent',
    label: 'browse.comcol.by.recent',
    routerLink: ''
  };

  ngOnInit(): void {
    super.ngOnInit();

    let comColRoute: string;
    if (this.contentType === 'collection') {
      comColRoute = getCollectionPageRoute(this.id);
    } else if (this.contentType === 'community') {
      comColRoute = getCommunityPageRoute(this.id);
    }

    this.allOptions$ = combineLatest([
      of([{ ...this.recent, ...{
      routerLink: `${comColRoute}/recent`
    }}]),
      this.allOptions$
    ]).pipe(
      map(([recentArray, allOptions]) => [...recentArray, ...allOptions])
    );

    this.subs.push(combineLatest([
      this.allOptions$,
      this.router.events.pipe(
        startWith(this.router),
        filter((next: Router|Scroll) => (isNotEmpty((next as Router)?.url) || (next as Scroll)?.type === EventType.Scroll)),
        map((next: Router|Scroll) => (next as Router)?.url || ((next as Scroll).routerEvent as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged(),
      ),
    ]).subscribe(([navOptions, url]: [ComColPageNavOption[], string]) => {
      for (const option of navOptions) {
        if (url?.split('?')[0] === comColRoute && option.id === this.appConfig[this.contentType].defaultBrowseTab) {
          void this.router.navigate([option.routerLink], { queryParams: option.params });
          break;
        } else if (option.routerLink === url?.split('?')[0]) {
          this.currentOption$.next(option);
          break;
        }
      }
    }));

    if (this.router.url?.split('?')[0] === comColRoute) {
      this.allOptions$.pipe(
        take(1),
      ).subscribe((allOptions: ComColPageNavOption[]) => {
        for (const option of allOptions) {
          if (option.id === this.appConfig[this.contentType].defaultBrowseTab) {
            this.currentOption$.next(option[0]);
            void this.router.navigate([option.routerLink], { queryParams: option.params });
            break;
          }
        }
      });
    }
  }

}
