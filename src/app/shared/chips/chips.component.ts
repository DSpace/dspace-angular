import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { Chips} from './chips.model';
import { UploadFilesService } from '../upload-files/upload-files.service';
import { SortablejsOptions } from 'angular-sortablejs';
import { ChipsItem } from './chips-item.model';

@Component({
  selector: 'ds-chips',
  styleUrls: ['./chips.component.scss'],
  templateUrl: './chips.component.html',
})

export class ChipsComponent implements OnChanges {
  @Input() chips: Chips;
  @Input() editable: boolean;

  @Output() selected: EventEmitter<number> = new EventEmitter<number>();
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  options: SortablejsOptions;
  dragged = -1;

  constructor(private uploadFilesService: UploadFilesService) {
    this.options = {
      animation: 300,
      dragClass: 'm-0',
      ghostClass: 'm-0',
      chosenClass: 'm-0'
    };
  }

  ngOnInit() {
    if (!this.editable) {
      this.editable = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
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

  onDrag(event) {
    this.uploadFilesService.overrideDragOverPage();
    this.dragged = event;
  }

  onDragEnd(event) {
    this.uploadFilesService.allowDragOverPage();
    this.dragged = -1;
    this.chips.updateOrder();
  }

}
