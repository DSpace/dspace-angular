import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { Chips, ChipsItem } from './chips.model';
import { UploadFilesService } from '../upload-files/upload-files.service';
import { SortablejsOptions } from 'angular-sortablejs';

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
      onUpdate: (event: any) => {
        this.onDrop(event);
      },
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
      this.chips.chipsItems.forEach((item: ChipsItem, i: number) => {
        if (i === index) {
          item.editMode = true;
        } else {
          item.editMode = false;
        }
      });
      this.selected.emit(index);
    }
  }

  removeChips(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    // Can't remove if this element is in editMode
    if (!this.chips.chipsItems[index].editMode) {
      this.chips.remove(index);
      this.remove.emit(index);
    }
  }

  onBlur(event, index) {
    console.log("blur ", event, index);
  }
  onDrag(event) {
    this.uploadFilesService.overrideDragOverPage();
    this.dragged = event;
  }

  onDragEnd(event) {
    this.uploadFilesService.allowDragOverPage();
    this.dragged = -1;
    this.change.emit(event);
  }

  onDrop(event) {
    this.change.emit(event);
  }

}
