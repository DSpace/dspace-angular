import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { ClarinDateService } from '../../../../shared/clarin-date.service';

@Component({
  selector: 'ds-clarin-date-item-field',
  templateUrl: './clarin-date-item-field.component.html',
  styleUrls: ['./clarin-date-item-field.component.scss']
})
export class ClarinDateItemFieldComponent implements OnInit {

  constructor(private clarinDateService: ClarinDateService) {
  }

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  updatedDateValue: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.updatedDateValue.next(this.clarinDateService.composeItemDate(this.item));
  }
}
