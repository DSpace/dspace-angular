import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { LayoutTab } from 'src/app/layout/enums/layout-tab.enum';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { LayoutPage } from 'src/app/layout/enums/layout-page.enum';
import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { MetadataComponentsDataService } from 'src/app/core/layout/metadata-components-data.service';
import { getAllSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { Subscription } from 'rxjs';
import { hasValue } from 'src/app/shared/empty.util';

/**
 * This component renders the metadata boxes of items
 */
@Component({
  selector: 'ds-cris-layout-metadata-box',
  templateUrl: './cris-layout-metadata-box.component.html',
  styleUrls: ['./cris-layout-metadata-box.component.scss']
})
/**
 * For overwrite this component create a new one that extends CrisLayoutBoxObj and
 * add the CrisLayoutBox decorator indicating the type of box to overwrite
 */
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.METADATA)
export class CrisLayoutMetadataBoxComponent extends CrisLayoutBoxObj implements OnInit, OnDestroy {

  /**
   * Contains the fields configuration for current box
   */
  metadatacomponents: MetadataComponent;

  /**
   * true if the item has a thumbanil, false otherwise
   */
  hasThumbnail = false;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    public cd: ChangeDetectorRef,
    private metadatacomponentsService: MetadataComponentsDataService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.subs.push(this.metadatacomponentsService.findById(this.box.id)
      .pipe(getAllSucceededRemoteDataPayload())
      .subscribe(
        (next) => {
          this.metadatacomponents = next;
          this.cd.markForCheck();
        }
      ));
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
