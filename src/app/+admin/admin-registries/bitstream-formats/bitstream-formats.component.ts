import { Component } from '@angular/core';
import { RegistryService } from '../../../core/registry/registry.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { BitstreamFormat } from '../../../core/registry/mock-bitstream-format.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

/**
 * This component renders a list of bitstream formats
 */
@Component({
  selector: 'ds-bitstream-formats',
  templateUrl: './bitstream-formats.component.html'
})
export class BitstreamFormatsComponent {

  /**
   * A paginated list of bitstream formats to be shown on the page
   */
  bitstreamFormats: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;

  /**
   * The current pagination configuration for the page
   * Currently simply renders all bitstream formats
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-bitstreamformats-pagination',
    pageSize: 10000
  });

  constructor(private registryService: RegistryService) {
    this.updateFormats();
  }

  /**
   * When the page is changed, make sure to update the list of bitstreams to match the new page
   * @param event The page change event
   */
  onPageChange(event) {
    this.config.currentPage = event;
    this.updateFormats();
  }

  /**
   * Method to update the bitstream formats that are shown
   */
  private updateFormats() {
    this.bitstreamFormats = this.registryService.getBitstreamFormats(this.config);
  }
}
