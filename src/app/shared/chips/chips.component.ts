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


  // ngDoCheck() {
  //   var changes = this.differ.diff(this.chipsEntries);
  //
  //   if(changes) {
  //     this.chipsEntries = changes.va;
  //     this.setItems();
  //
  //     console.log('changes detected');
  //     changes.forEachChangedItem(r => console.log('changed ', r.currentValue));
  //     changes.forEachAddedItem(r => console.log('added ' + r.currentValue));
  //     changes.forEachRemovedItem(r => console.log('removed ' + r.currentValue));
  //
  //   } else {
  //     console.log('nothing changed');
  //   }
  // }

}
