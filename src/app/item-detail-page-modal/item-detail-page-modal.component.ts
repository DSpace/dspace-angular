import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { ItemDataService } from '../core/data/item-data.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../core/shared/operators';


@Component({
  selector: 'ds-item-detail-page-modal',
  templateUrl: './item-detail-page-modal.component.html',
  styleUrls: ['./item-detail-page-modal.component.scss']
})
export class ItemDetailPageModalComponent implements OnInit {


  /**
   * UUID of which to get item
   */
  @Input() uuid: string;


  /**
   * Close event emit to close modal
   */
  @Output() close: EventEmitter<string> = new EventEmitter<string>();

  itemRD$: Observable<Item>;

  constructor(private itemService: ItemDataService,
    private modalService: NgbModal,
  ) {
  }


  /**
   * When component starts initialize starting functionality
   */
  ngOnInit(): void {
    this.itemRD$ = this.itemService.findById(this.uuid).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }

  /**
   * When close button is pressed emit function to close modal
   */
  c(text): void {
    this.close.emit(text);
  }
}
