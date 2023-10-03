import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { ReferrerService } from '../../../core/services/referrer.service';

/**
 * This component triggers a page view statistic
 */
@Component({
  selector: 'ds-view-tracker',
  styleUrls: ['./view-tracker.component.scss'],
  templateUrl: './view-tracker.component.html',
})
export class ViewTrackerComponent implements OnInit, OnDestroy {
  /**
   * The DSpaceObject to track a view event about
   */
  @Input() object: DSpaceObject;

  /**
   * The subscription on this.referrerService.getReferrer()
   * @protected
   */
  protected sub: Subscription;

  constructor(
    public angulartics2: Angulartics2,
    public referrerService: ReferrerService
  ) {
  }

  ngOnInit(): void {
    this.sub = this.referrerService.getReferrer()
      .pipe(take(1))
      .subscribe((referrer: string) => {
        this.angulartics2.eventTrack.next({
          action: 'page_view',
          properties: {
            object: this.object,
            referrer
          },
        });
      });
  }

  ngOnDestroy(): void {
    // unsubscribe in the case that this component is destroyed before
    // this.referrerService.getReferrer() has emitted
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
