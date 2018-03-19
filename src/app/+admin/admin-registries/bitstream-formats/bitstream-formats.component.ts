import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { BitstreamFormat } from '../../../core/registry/mock-bitstream-format.model';

@Component({
  selector: 'ds-bitstream-formats',
  templateUrl: './bitstream-formats.component.html'
})
export class BitstreamFormatsComponent {

  bitstreamFormats: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;

  constructor(registryService: RegistryService) {
    this.bitstreamFormats = registryService.getBitstreamFormats();
  }
}
