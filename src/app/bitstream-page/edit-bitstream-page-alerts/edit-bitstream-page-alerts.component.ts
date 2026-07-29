import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  from,
  mergeMap,
} from 'rxjs';
import {
  filter,
  map,
  toArray,
} from 'rxjs/operators';

const RELATED_BITSTREAM_PREFIX = 'dspace.bitstream.';
const RELATED_BITSTREAM_QUALIFIERS = [
  'isCopyOf',
  'hasCopies',
  'isReplacementOf',
  'isReplacedBy',
];

interface RelatedBitstream {
  text: string;
  uuid: string;
  error?: number
}

@Component({
  selector: 'ds-edit-bitstream-page-alerts',
  styleUrls: ['./edit-bitstream-page-alerts.component.scss'],
  templateUrl: './edit-bitstream-page-alerts.component.html',
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
/**
 * Displays alerts for related bitstreams in the replacement/versioning context
 */
export class EditBitstreamPageAlertsComponent implements OnInit {
  @Input() bitstream: Bitstream;

  /**
   * Related bitstreams in the replacement/versioning context
   */
  protected relatedBitstreams$: BehaviorSubject<[string, RelatedBitstream[]][]> = new BehaviorSubject([]);

  constructor(
    private bitstreamService: BitstreamDataService,
    private dsoNameService: DSONameService,
  ) {
  }

  ngOnInit() {
    from(RELATED_BITSTREAM_QUALIFIERS).pipe(
      filter(qualifier => this.bitstream?.hasMetadata(RELATED_BITSTREAM_PREFIX + qualifier)),
      mergeMap((qualifier: string) => {
        return from(this.bitstream.allMetadata(RELATED_BITSTREAM_PREFIX + qualifier)).pipe(
          mergeMap(mdv => {
            return this.bitstreamService.findById(mdv.authority).pipe(
              getFirstCompletedRemoteData(),
              map(((bitstreamRD: RemoteData<Bitstream>) => {
                if (bitstreamRD.hasSucceeded) {
                  return {
                    text: this.dsoNameService.getName(bitstreamRD.payload),
                    uuid: bitstreamRD.payload.uuid,
                  } as RelatedBitstream;
                } else {
                  return {
                    text: mdv.value,
                    uuid: mdv.authority,
                    error: bitstreamRD.statusCode,
                  } as RelatedBitstream;
                }
              })),
            );
          }),
          toArray(),
          map(bitstreams => [qualifier, bitstreams]),
        );
      }),
      toArray(),
    ).subscribe((sections: [string, RelatedBitstream[]][]) => {
      this.relatedBitstreams$.next(sections);
    });

  }
}
