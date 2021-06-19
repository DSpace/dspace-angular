import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../../models/cris-layout-box.model';
import { CrisLayoutBox } from '../../../decorators/cris-layout-box.decorator';
import { LayoutTab } from '../../../enums/layout-tab.enum';
import { LayoutBox } from '../../../enums/layout-box.enum';
import { LayoutPage } from '../../../enums/layout-page.enum';
import { MetadataComponent } from '../../../../core/layout/models/metadata-component.model';
import { MetadataComponentsDataService } from '../../../../core/layout/metadata-components-data.service';
import { getAllSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { Subscription } from 'rxjs';
import { hasValue } from '../../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';

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
 * add the CrisLayoutBoxModelComponent decorator indicating the type of box to overwrite
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

  /**
   * Variable to understand if the next box clear value
   */
  nextBoxClear = true;

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '1';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') margin = '0px';


  constructor(
    public cd: ChangeDetectorRef,
    protected metadatacomponentsService: MetadataComponentsDataService,
    protected translateService: TranslateService,
  ) {
    super(translateService);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.box.clear) {
      this.flex = '0 0 100%';
    }

    if (!this.box.clear && !this.nextBoxClear) {
      this.margin = '10px';
    }

    this.subs.push(this.metadatacomponentsService.findById(this.box.id)
      .pipe(getAllSucceededRemoteDataPayload())
      .subscribe(
        (next) => {
          this.setMetadataComponents(next);
          this.cd.markForCheck();
        }
      ));
  }

  /**
   * Set the metadatacomponents.
   * @param metadatacomponents
   */
  setMetadataComponents(metadatacomponents: MetadataComponent) {
    this.metadatacomponents = metadatacomponents;
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
