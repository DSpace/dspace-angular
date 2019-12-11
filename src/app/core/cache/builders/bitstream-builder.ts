import { Injector } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamDataService } from '../../data/bitstream-data.service';
import { BitstreamFormatDataService } from '../../data/bitstream-format-data.service';
import { RemoteData } from '../../data/remote-data';
import { BitstreamFormat } from '../../shared/bitstream-format.model';
import { Bitstream } from '../../shared/bitstream.model';
import { Item } from '../../shared/item.model';

export const getBitstreamBuilder = (parentInjector: Injector, bitstream: Bitstream) => {
  const injector = Injector.create({
    providers:[
      {
        provide: BitstreamBuilder,
        useClass: BitstreamBuilder,
        deps:[
          BitstreamDataService,
          BitstreamFormatDataService,
        ]
      }
    ],
    parent: parentInjector
  });
  return injector.get(BitstreamBuilder).initWithBitstream(bitstream);
};

export class BitstreamBuilder {
  private bitstream: Bitstream;
  private thumbnail: Observable<RemoteData<Bitstream>>;
  private format: Observable<RemoteData<BitstreamFormat>>;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected bitstreamFormatDataService: BitstreamFormatDataService
  ) {
  }

  initWithBitstream(bitstream: Bitstream): BitstreamBuilder {
    this.bitstream = bitstream;
    return this;
  }

  loadThumbnail(item: Item): BitstreamBuilder {
    this.thumbnail = this.bitstreamDataService.getMatchingThumbnail(item, this.bitstream);
    return this;
  }

  loadBitstreamFormat(): BitstreamBuilder {
    this.format = this.bitstreamFormatDataService.findByBitstream(this.bitstream);
    return this;
  }

  build(): Bitstream {
    const bitstream = this.bitstream;
    bitstream.thumbnail = this.thumbnail;
    bitstream.format = this.format;
    return bitstream;
  }

}
