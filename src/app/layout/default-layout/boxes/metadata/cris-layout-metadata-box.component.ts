import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { LayoutTab } from 'src/app/layout/enums/layout-tab.enum';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { LayoutPage } from 'src/app/layout/enums/layout-page.enum';
import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { MetadataComponentsDataService } from 'src/app/core/layout/metadata-components-data.service';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { Observable, Subscription } from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
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

  metadatacomponents: MetadataComponent;

  bitstream = [];
  metadata: [];
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
    private metadatacomponentsService: MetadataComponentsDataService,
    private bitstreamDataService: BitstreamDataService
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
          this.retrieveBitstream(this.metadatacomponents);
          this.cd.markForCheck();
        }
      ));
  }

  /**
   * Retrivies all bitstream from the box configuration
   * and check if exists a thumbnail
   * @param metadatacomponents
   */
  retrieveBitstream(metadatacomponents: MetadataComponent) {
    metadatacomponents.rows.forEach((row) => {
      row.fields.forEach((field) => {
        if (field.fieldType.toLowerCase() === 'bitstream') {
          this.bitstream.push(field);
          return;
        }
      });
    });
    if (this.hasBitstream()) {
      this.subs.push(
        this.getThumbnail().subscribe(
          (next) => {
            this.hasThumbnail = false;
          }, null,
          () => {
            this.hasThumbnail = true;
          }
        )
      );
    }
    this.hasThumbnail = this.hasBitstream();
  }

  hasBitstream() {
    return hasValue(this.bitstream) && this.bitstream.length > 0;
  }

  /**
   * Returns a Observable of Bistream with Thumbnail for current item
   */
  getThumbnail(): Observable<Bitstream> {
    return this.bitstreamDataService.getThumbnailFor(this.item).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
