import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { BitstreamFormatDataService } from '../../../../core/data/bitstream-format-data.service';
import { RestResponse } from '../../../../core/cache/response.models';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { getBitstreamFormatsModulePath } from '../../admin-registries-routing.module';
import { TranslateService } from '@ngx-translate/core';

/**
 * This component renders the page to create a new bitstream format.
 */
@Component({
  selector: 'ds-add-bitstream-format',
  templateUrl: './add-bitstream-format.component.html',
})
export class AddBitstreamFormatComponent {

  constructor(
    private router: Router,
    private notificationService: NotificationsService,
    private translateService: TranslateService,
    private bitstreamFormatDataService: BitstreamFormatDataService,
  ) {
  }

  /**
   * Creates a new bitstream format based on the provided bitstream format emitted by the form.
   * When successful, a success notification will be shown and the user will be navigated back to the overview page.
   * When failed, an error  notification will be shown.
   * @param bitstreamFormat
   */
  createBitstreamFormat(bitstreamFormat: BitstreamFormat) {
    this.bitstreamFormatDataService.createBitstreamFormat(bitstreamFormat).pipe(take(1)
    ).subscribe((response: RestResponse) => {
        if (response.isSuccessful) {
          this.notificationService.success(this.translateService.get('admin.registries.bitstream-formats.create.success.head'),
            this.translateService.get('admin.registries.bitstream-formats.create.success.content'));
          this.router.navigate([getBitstreamFormatsModulePath()]);
          this.bitstreamFormatDataService.clearBitStreamFormatRequests().subscribe();
        } else {
          this.notificationService.error(this.translateService.get('admin.registries.bitstream-formats.create.failure.head'),
            this.translateService.get('admin.registries.bitstream-formats.create.failure.content'));
        }
      }
    );
  }
}
