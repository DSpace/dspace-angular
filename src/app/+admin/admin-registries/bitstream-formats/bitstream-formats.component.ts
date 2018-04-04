import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { BitstreamFormat } from '../../../core/registry/mock-bitstream-format.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-bitstream-formats',
  templateUrl: './bitstream-formats.component.html'
})
export class BitstreamFormatsComponent {

  bitstreamFormats: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-bitstreamformats-pagination',
    pageSize: 20
  });

  constructor(private registryService: RegistryService) {
    this.updateFormats();
  }

  onPageChange(event) {
    this.config.currentPage = event;
    this.updateFormats();
  }

  private updateFormats() {
    this.bitstreamFormats = this.registryService.getBitstreamFormats(this.config);
  }
}
