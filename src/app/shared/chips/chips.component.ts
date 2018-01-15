import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges, } from '@angular/core';
import { Chips, ChipsItem } from './chips.model';
import * as _ from 'lodash';

@Component({
  selector: 'ds-chips',
  styleUrls: ['./chips.component.scss'],
  templateUrl: './chips.component.html',
})

export class ChipsComponent implements OnChanges {
  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Output()
  change = new EventEmitter<any>();
  @Input()
  chips: Chips;
  @Input()
  editable;
  options;

  constructor() {
    this.options = {
      onUpdate: (event: any) => {
        this.onDrop(event);
      },
      animation: 300,
    };
  }

  ngOnInit() {
    if (!this.editable) {
      this.editable = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      // this.sortChips();
    }
  }

  chipsSelected(index) {
    this.chips.chipsItems.forEach((item, i) => {
      if (i === index) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
    ;
    this.selected.emit(index);
  }

  chipsBlur(index) {
    if (!this.editable) {
      // Case not editable, set different color and go back on blur
      this.chips.chipsItems[index].editMode = false;
    }
  }

  removeChips(index) {
    // Can't remove if this element is in editMode
    if (!this.chips.chipsItems[index].editMode) {
      this.chips.remove(index);
      this.remove.emit(index);
    }
  }

  onDrop(event) {
    // console.log(event);
    this.change.emit(event);
  }

}
