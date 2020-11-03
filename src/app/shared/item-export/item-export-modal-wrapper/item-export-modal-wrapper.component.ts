import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ItemExportFormatMolteplicity } from 'src/app/core/itemexportformat/item-export.service';
import { Item } from 'src/app/core/shared/item.model';
import { SearchOptions } from '../../search/search-options.model';
import { ItemExportComponent } from '../item-export/item-export.component';

@Component({
  selector: 'ds-item-export-modal-wrapper',
  templateUrl: './item-export-modal-wrapper.component.html'
})
export class ItemExportModalWrapperComponent {

  @Input() item: Item;
  @Input() searchOptions$: Observable<SearchOptions>;

  constructor(private modalService: NgbModal) { }

  getLabel() {
    return this.item ? 'Export' : 'Bulk Export'
  }

  open() {

    if (this.item) {

      // open a single item-export modal
      const modalRef = this.modalService.open(ItemExportComponent);
      modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
      modalRef.componentInstance.item = this.item;

    } else if (this.searchOptions$) {
      
      // open a bulk-item-export modal
      this.searchOptions$.pipe(take(1)).subscribe(searchOptions => {
        const modalRef = this.modalService.open(ItemExportComponent);
        modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
        modalRef.componentInstance.searchOptions = searchOptions;
      });
    }
    
  }

}
