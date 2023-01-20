import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';
import { RouteService } from '../../core/services/route.service';
import { Router } from '@angular/router';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '../empty.util';

@Component({
  selector: 'ds-results-back-button',
  styleUrls: ['./results-back-button.component.scss'],
  templateUrl: './results-back-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component to add back to result list button to item.
 */
export class ResultsBackButtonComponent {

  /**
   * Page number of the previous page
   */
  @Input() previousPage$?: BehaviorSubject<string>;

  /**
   * The pagination configuration used for the list
   */
  @Input() paginationConfig?: PaginationComponentOptions;

  /**
   * Tells component to always show the back button.
   * When not true the button is displayed based on
   * the previous route.
   */
  @Input() alwaysShowButton?: boolean;

  /**
   * Always show back button when true regardless of
   * previous route.
   */
  showBackButton: boolean;

  /**
   * The button text
   */
  buttonLabel: Observable<string>;

  constructor(protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected router: Router,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    if (this.paginationConfig) {
      this.buttonLabel = this.translateService.get('browse.back.all-results');
    } else {
      this.buttonLabel = this.translateService.get('search.browse.item-back');
    }

    if(this.alwaysShowButton) {
      this.showBackButton = true;
    }
    else {
      // Show the back button when the previous route was a search or browse list.
      // Include the button for admin search results and MyDspace.
      this.routeService.getPreviousUrl().pipe(
        filter(url => /^(\/search|\/browse|\/collections|\/admin\/search|\/mydspace)/.test(url)),
        take(1),
        map(() => true)
      ).subscribe(showButton => {
        this.showBackButton = showButton;
      });
    }
  }

  /**
   * Navigate back from the item to the previous pagination list.
   */
  public back() {
    if (isNotEmpty(this.paginationConfig) && isNotEmpty(this.previousPage$)) {
      // if pagination configuration is provided use it to update the route to the previous browse page.
      const page = +this.previousPage$.value > 1 ? +this.previousPage$.value : 1;
      this.paginationService.updateRoute(this.paginationConfig.id, {page: page}, {[this.paginationConfig.id + '.return']: null, value: null, startsWith: null});
    } else {
      this.routeService.getPreviousUrl().pipe(
        take(1)
      ).subscribe(
        (url => {
          this.router.navigateByUrl(url)
        })
      );
    }
  }

}
