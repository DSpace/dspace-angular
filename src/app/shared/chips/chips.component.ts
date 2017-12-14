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
  @Input()
  editable: boolean = true;
  inputText: string;


  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges..." + JSON.stringify(changes));
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
      console.log("ngOnChanges items=" + JSON.stringify(this.chips));
      // TODO Manage add item
    }
  }

  chipsSelected(index) {
    this.selected.emit(index);
  }

  removeChips(index) {
    this.remove.emit(index);
    this.chips.remove(index);
  }

  keyUp(event) {
    if (event.key === "Enter") {
      console.log(event);
      const l = this.inputText.length;
      this.chips.add(this.inputText.substr(0, l-1));
    }

    // TODO Verify edit of input
    // const l = this.inputText.length;
    // if (this.inputText.substr(l-1, l) === ',') {
    //   this.chips.add(this.inputText.substr(0, l-1));
    // }
  }

}
