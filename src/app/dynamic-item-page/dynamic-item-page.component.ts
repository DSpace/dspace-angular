import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { DynamicLayoutComponent } from '../dynamic-layout/dynamic-layout.component';
import { ThemedItemAlertsComponent } from '../item-page/alerts/themed-item-alerts.component';
import { fadeInOut } from '../shared/animations/fade';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';

/**
 * Entry point component for the dynamic item page.
 *
 * Resolves the item from route data and passes it to {@link DynamicLayoutComponent},
 * which handles tab resolution and layout rendering. Also checks admin authorization
 * for displaying admin-specific UI elements.
 */
@Component({
  selector: 'ds-dynamic-item-page',
  templateUrl: './dynamic-item-page.component.html',
  styleUrls: ['./dynamic-item-page.component.scss'],
  animations: [fadeInOut],
  imports: [
    AsyncPipe,
    DynamicLayoutComponent,
    ThemedItemAlertsComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class DynamicItemPageComponent implements OnInit {

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  itemRD$: Observable<RemoteData<Item>>;

  constructor(
    private authorizationService: AuthorizationDataService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
    );

    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

}
