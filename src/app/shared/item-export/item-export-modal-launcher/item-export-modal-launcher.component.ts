import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Item } from '../../../core/shared/item.model';
import { SearchOptions } from '../../search/search-options.model';
import { ItemExportComponent } from '../item-export/item-export.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';

@Component({
  selector: 'ds-item-export-modal-launcher',
  templateUrl: './item-export-modal-launcher.component.html'
})
export class ItemExportModalLauncherComponent implements OnInit {

  @ViewChild('template', {static: true}) template;

  @Input() item: Item;
  @Input() searchOptions$: Observable<SearchOptions>;

  constructor(private modalService: NgbModal,
              private authService: AuthService,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
  }

  getLabel() {
    return this.item ? 'Export' : 'Bulk Export';
  }

  open() {

    if (this.item) {

      // open a single item-export modal
      const modalRef = this.modalService.open(ItemExportComponent);
      modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
      modalRef.componentInstance.item = this.item;

    } else if (this.searchOptions$) {

      // open a bulk-item-export modal
      this.searchOptions$.pipe(take(1)).subscribe((searchOptions) => {
        const modalRef = this.modalService.open(ItemExportComponent);
        modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.MULTIPLE;
        modalRef.componentInstance.searchOptions = searchOptions;
      });
    }

  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
