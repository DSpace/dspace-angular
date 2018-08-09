import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsOptions } from 'angular-sortablejs';
import { isObject } from 'lodash';

import { Chips } from './models/chips.model';
import { ChipsItem } from './models/chips-item.model';
import { UploaderService } from '../uploader/uploader.service';

@Component({
  selector: 'ds-chips',
  styleUrls: ['./chips.component.scss'],
  templateUrl: './chips.component.html',
})

export class ChipsComponent implements OnChanges {
  @Input() chips: Chips;
  @Input() wrapperClass: string;
  @Input() editable = true;

  @Output() selected: EventEmitter<number> = new EventEmitter<number>();
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  options: SortablejsOptions;
  dragged = -1;
  tipText: string;

  constructor(private cdr: ChangeDetectorRef, private uploaderService: UploaderService) {
    this.options = {
      animation: 300,
      chosenClass: 'm-0',
      dragClass: 'm-0',
      filter: '.chips-sort-ignore',
      ghostClass: 'm-0'
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
    }
  }

  chipsSelected(event: Event, index: number) {
    event.preventDefault();
    if (this.editable) {
      this.chips.getChips().forEach((item: ChipsItem, i: number) => {
        if (i === index) {
          item.setEditMode();
        } else {
          item.unsetEditMode();
        }
      });
      this.selected.emit(index);
    }
  }

  removeChips(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    // Can't remove if this element is in editMode
    if (!this.chips.getChipByIndex(index).editMode) {
      this.chips.remove(this.chips.getChipByIndex(index));
    }
  }

  onDragStart(index) {
    this.uploaderService.overrideDragOverPage();
    this.dragged = index;
  }

  onDragEnd(event) {
    this.uploaderService.allowDragOverPage();
    this.dragged = -1;
    this.chips.updateOrder();
  }

  showTooltip(tooltip: NgbTooltip, index, field?) {
    tooltip.close();
    const item = this.chips.getChipByIndex(index);
    if (!item.editMode && this.dragged === -1) {
      if (field) {
        this.tipText = (isObject(item.item[field])) ? item.item[field].display : item.item[field];
      } else {
        this.tipText = item.display;
      }

      this.cdr.detectChanges();
      tooltip.open();
    }
  }

}
