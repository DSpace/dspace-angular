import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  NgbTooltip,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import isObject from 'lodash/isObject';
import { SortablejsModule } from 'ngx-sortablejs';
import { BehaviorSubject } from 'rxjs';
import { Options } from 'sortablejs';

import { DragService } from '../../../core/drag.service';
import { AuthorityConfidenceStateDirective } from '../directives/authority-confidence-state.directive';
import { Chips } from './models/chips.model';
import { ChipsItem } from './models/chips-item.model';

@Component({
  selector: 'ds-chips',
  styleUrls: ['./chips.component.scss'],
  templateUrl: './chips.component.html',
  imports: [
    NgbTooltipModule,
    NgClass,
    NgForOf,
    SortablejsModule,
    AsyncPipe,
    AuthorityConfidenceStateDirective,
    NgIf,
    TranslateModule,
  ],
  standalone: true,
})

export class ChipsComponent implements OnChanges {
  @Input() chips: Chips;
  @Input() wrapperClass: string;
  @Input() editable = true;
  @Input() showIcons = false;

  @Output() selected: EventEmitter<number> = new EventEmitter<number>();
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  isDragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  options: Options;
  dragged = -1;
  tipText: string[];

  constructor(
    private cdr: ChangeDetectorRef,
    private dragService: DragService,
    private translate: TranslateService) {

    this.options = {
      animation: 300,
      chosenClass: 'm-0',
      dragClass: 'm-0',
      filter: '.chips-sort-ignore',
      ghostClass: 'm-0',
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
    }
  }

  chipsSelected(event: Event, index: number) {
    event.preventDefault();
    if (this.editable) {
      this.chips.getChips().forEach((item: ChipsItem, i: number) => {
        if (i === index) {
          item.setEditMode();
        } else {
          item.unsetEditMode();
        }
      });
      this.selected.emit(index);
    }
  }

  removeChips(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    // Can't remove if this element is in editMode
    if (!this.chips.getChipByIndex(index).editMode) {
      this.chips.remove(this.chips.getChipByIndex(index));
    }
  }

  onDragStart(index) {
    this.isDragging.next(true);
    this.dragService.overrideDragOverPage();
    this.dragged = index;
  }

  onDragEnd(event) {
    this.dragService.allowDragOverPage();
    this.dragged = -1;
    this.chips.updateOrder();
    this.isDragging.next(false);
  }

  showTooltip(tooltip: NgbTooltip, index, field?) {
    tooltip.close();
    const chipsItem = this.chips.getChipByIndex(index);
    const textToDisplay: string[] = [];
    if (!chipsItem.editMode && this.dragged === -1) {
      if (field) {
        if (isObject(chipsItem.item[field])) {
          textToDisplay.push(chipsItem.item[field].display);
          if (chipsItem.item[field].hasOtherInformation()) {
            Object.keys(chipsItem.item[field].otherInformation)
              .forEach((otherField) => {
                this.translate.get('form.other-information.' + otherField)
                  .subscribe((label) => {
                    textToDisplay.push(label + ': ' + chipsItem.item[field].otherInformation[otherField]);
                  });
              });
          }
        } else {
          textToDisplay.push(chipsItem.item[field]);
        }
      } else {
        textToDisplay.push(chipsItem.display);
      }

      this.cdr.detectChanges();
      if (!chipsItem.hasIcons() || !chipsItem.hasVisibleIcons() || field) {
        this.tipText = textToDisplay;
        tooltip.open();
      }

    }
  }

}
