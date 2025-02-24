import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  DSpaceObject,
  ReferrerService,
} from '@dspace/core';
import { hasValue } from '@dspace/shared/utils';
import { Angulartics2 } from 'angulartics2';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * This component triggers a page view statistic
 */
@Component({
  selector: 'ds-view-tracker',
  styleUrls: ['./view-tracker.component.scss'],
  templateUrl: './view-tracker.component.html',
  standalone: true,
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
    public referrerService: ReferrerService,
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
            referrer,
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
