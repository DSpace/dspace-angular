import { ChangeDetectionStrategy, Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { RouteService } from '../../core/services/route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ds-item-back-button',
  styleUrls: ['./item-back-button.component.scss'],
  templateUrl: './item-back-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component to add back to result list button to item.
 */
export class ItemBackButtonComponent {

  constructor(protected routeService: RouteService,
              protected router: Router) {
  }

  /**
   * Navigate back from the item to the previous pagination url.
   */
  public back() {
    this.routeService.getPreviousUrl().pipe(
      take(1)
    ).subscribe(
      (url => this.router.navigateByUrl(url))
    );
  }

}
