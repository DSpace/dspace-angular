import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ds-upload-bitstream',
  templateUrl: './upload-bitstream.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Page component for uploading a bitstream to an item
 */
export class UploadBitstreamComponent implements OnInit {

  /**
   * The item to upload a bitstream to
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The name of the bundle to add the bitstream to
   * Defaults to ORIGINAL
   */
  bundleName$: Observable<string>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.bundleName$ = this.route.queryParams.pipe(map((params) => params.bundleName));
  }

}
