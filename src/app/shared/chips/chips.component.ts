import {Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges,} from '@angular/core';
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
  @Input()
  chips: Chips;
  @Input()
  editable;

  ngOnInit() {
    if (!this.editable) {
      this.editable = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      this.chips.chipsItems = _.sortBy(changes.chips.currentValue, 'order')  as ChipsItem[];
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

  onMove(chipsItem: ChipsItem, position: number) {
    console.log(chipsItem.order + 'to' + position);

    let delta;
    if (position > chipsItem.order) {
      delta = 'forward';
    } else {
      delta = 'back';
    }

    this.chips.chipsItems.forEach( (current) => {
      // current.order = current.order > position ?
      if (current.order === chipsItem.order) {
        // Moved Object
        current.order = position;
      }
      if (delta === 'forward' && current.order > chipsItem.order && current.order <= position) {
        current.order--;
      } else if (delta === 'back' && current.order < chipsItem.order && current.order >= position) {
        current.order++;
      }
      console.log(current.item['local.contributor.orcid'] + 'in position ' + current.order);
    });

  }

}
