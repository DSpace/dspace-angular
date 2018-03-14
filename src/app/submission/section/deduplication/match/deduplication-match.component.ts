import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-deduplication-match',
  templateUrl: 'deduplication-match.component.html',
})

export class DeduplicationMatchComponent implements OnInit {
  @Input()
  match: DSpaceObject;
  @Input()
  submissionId: string;
  object = {hitHighlights: []};
  item: Item;

  ngOnInit(): void {
    if ((this.match as any).item) {
      // WSI & WFI
      this.item = Object.assign(new Item(), (this.match as any).item);
    } else {
      // Item
      this.item = Object.assign(new Item(), this.item);
    }
  }

  setAsDuplicated(index: number) {
    console.log('Setting item #' + this.item.uuid + ' as duplicated...');
  }

  setAsNotDuplicated(index: number) {
    console.log('Setting item #' + this.item.uuid + ' as not duplicated...');
  }


}
