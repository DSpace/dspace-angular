import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,} from '@angular/core';
import {Chips} from './chips.model';

@Component({
  selector: 'ds-chips',
  styleUrls: [ './chips.component.scss' ],
  templateUrl: './chips.component.html',
})

export class ChipsComponent implements OnChanges {
  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Input()
  chips: Chips;

  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges...' + JSON.stringify(changes));
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      // console.log('ngOnChanges items=' + JSON.stringify(this.chips));
    }
  }

  chipsSelected(index) {
    this.selected.emit(index);
  }

  removeChips(index) {
    this.chips.remove(index);
    this.remove.emit(index);
  }

}
