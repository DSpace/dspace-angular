import {Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges,} from '@angular/core';
import {Chips} from './chips.model';

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
    // console.log('ngOnChanges...' + JSON.stringify(changes));
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      // console.log('ngOnChanges items=' + JSON.stringify(this.chips));
    }
  }

  chipsSelected(index) {
    // Case Editable, set different color ang go back managed by external component
    // Case not editable, set different color and go back on blur
    // if (!this.chips.chipsItems[index].editMode) {
    //   // Can't reselect if selected yet
    //   this.chips.chipsItems[index].editMode = true
    this.chips.chipsItems.forEach((item, i) => {
      if (i === index) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
    ;
    this.selected.emit(index);


    // }
  }

  chipsBlur(index) {
    if (!this.editable) {
      // Case not editable, set different color and go back on blur
      this.chips.chipsItems[index].editMode = false;
    }
  }

  removeChips(index) {
    if (!this.chips.chipsItems[index].editMode) {
      // Can't remove if this element is in editMode
      this.chips.remove(index);
      this.remove.emit(index);
    }
  }

}
