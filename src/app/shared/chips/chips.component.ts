import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges,} from "@angular/core";
import {Chips} from "./chips.model";

@Component({
  selector: 'ds-chips',
  styleUrls: [ './chips.component.scss' ],
  templateUrl: './chips.component.html',
})

export class ChipsComponent implements OnInit, OnChanges {
  @Output()
  selected = new EventEmitter<number>();
  @Output()
  remove = new EventEmitter<number>();
  @Input()
  chips: Chips;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges..." + JSON.stringify(changes));
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      console.log("ngOnChanges items=" + JSON.stringify(this.chips));
    }
  }

  chipsSelected(index) {
    this.selected.emit(index);
  }

  removeChips(index) {
    this.remove.emit(index);
    this.chips.remove(index);
  }

  // addInputChips(text: string) {
  //   const l = text.length;
  //   if ( l > 2) {
  //     this.chips.add(text.substring(0, text.length - 1));
  //     text.split(',');
  //
  //   }
  // }

}
