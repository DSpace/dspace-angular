import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output, PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import isObject from 'lodash/isObject';

import { Chips } from './models/chips.model';
import { ChipsItem } from './models/chips-item.model';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { isNotEmpty } from '../../empty.util';
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


const TOOLTIP_TEXT_LIMIT = 21;
@Component({
  selector: 'ds-chips',
  styleUrls: ['./chips.component.scss'],
  templateUrl: './chips.component.html',
})
export class ChipsComponent implements OnChanges {
  @Input() chips: Chips;
  @Input() wrapperClass: string;
  @Input() editable = false;
  @Input() showIcons = false;
  @Input() clickable = true;

  @Output() selected: EventEmitter<number> = new EventEmitter<number>();
  @Output() remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  isDragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  dragged = -1;
  tipText$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * Whether a platform id represents a browser platform.
   */
  isPlatformBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chips && !changes.chips.isFirstChange()) {
      this.chips = changes.chips.currentValue;
    }
  }

  ngOnInit(): void {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
  }

  chipsSelected(event: Event, index: number) {
    event.preventDefault();
    this.selected.emit(index);
  }

  removeChips(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    // Can't remove if this element is in editMode
    if (!this.chips.getChipByIndex(index).editMode) {
      this.chips.remove(this.chips.getChipByIndex(index));
    }
  }

  onDrag(index) {
    this.isDragging.next(true);
    this.dragged = index;
  }

  onDrop(event: CdkDragDrop<{ index: number }>) {
    const previousContainerIndex = event.previousContainer.data.index;
    const currentContainerIndex = event.container.data.index;

    const currentPositionInCurrentContainer = event.currentIndex;

    // if we move forward we need to adjust the new position
    const directionAdjuster = currentContainerIndex > previousContainerIndex ? -1 : 0;

    moveItemInArray(this.chips.chipsItems.getValue(),
      previousContainerIndex,
      currentContainerIndex + currentPositionInCurrentContainer + directionAdjuster);
    this.dragged = -1;
    this.chips.updateOrder();
    this.isDragging.next(false);
  }

  showTooltip(tooltip: NgbTooltip, index, field?) {
    tooltip.close();
    let canShowToolTip = true;
    if (this.isDragging.value) {
      return;
    }
    const chipsItem = this.chips.getChipByIndex(index);
    const textToDisplay: string[] = [];
    if (!chipsItem.editMode && this.dragged === -1) {
      if (field) {
        if (isObject(chipsItem.item[field])) {
          textToDisplay.push(chipsItem.item[field].display);
          let otherInformationKeys: string[] = null;
          if (
            chipsItem.item[field].hasOtherInformation() &&
            isNotEmpty(otherInformationKeys = this.getDisplayableOtherInformationKeys(chipsItem, field))
          ) {
            forkJoin(
              otherInformationKeys
                .map((otherField) =>
                  this.translate.get('form.other-information.' + otherField)
                    .pipe(
                      map((label) => `${label}: ${chipsItem.item[field].otherInformation[otherField].split('::')[0]}`),
                      take(1)
                    )
                )
            ).subscribe(entries => textToDisplay.push(...entries));
          }
          if (this.hasWillBeReferenced(chipsItem, field)) {
            textToDisplay.push(this.getWillBeReferencedContent(chipsItem, field));
          }
        } else {
          textToDisplay.push(chipsItem.item[field]);
        }
      } else {
        textToDisplay.push(chipsItem.display);
        canShowToolTip = this.toolTipVisibleCheck(chipsItem.display);
      }
      if ((!chipsItem.hasIcons() || !chipsItem.hasVisibleIcons() || field) && canShowToolTip) {
        this.tipText$.next(textToDisplay);
        tooltip.open();
      }
    }
  }

  private getDisplayableOtherInformationKeys(chipsItem: ChipsItem, field: string): string[] {
    return Object.keys(chipsItem.item[field]?.otherInformation)
      .filter((otherInformationKey: string) =>
        !otherInformationKey.startsWith('data-') &&
        this.checkOtherInformationValue(chipsItem, field, otherInformationKey)
      );
  }

  private checkOtherInformationValue(chipsItem: ChipsItem, itemField: string, otherInformationKey: string) {
    const otherInformationMetadataFieldKey = otherInformationKey.replace(/\_/g, '.');
    const otherInformation = chipsItem.item[itemField]?.otherInformation;
    const [otherInformationValue, otherInformationAuthority] = otherInformation[otherInformationKey].split('::');
    return !chipsItem.item[otherInformationMetadataFieldKey]?.hasPlaceholder() &&
      chipsItem.item[otherInformationMetadataFieldKey]?.value === otherInformationValue &&
      chipsItem.item[otherInformationMetadataFieldKey]?.authority === otherInformationAuthority;
  }

  hasWillBeGenerated(chip: ChipsItem, metadata: string) {
    const metadataValue = chip.item[metadata];
    return metadataValue?.authority?.startsWith('will be generated::');
  }

  hasWillBeReferenced(chip: ChipsItem, metadata: string) {
    const metadataValue = chip.item[metadata];
    return metadataValue?.authority?.startsWith('will be referenced::');
  }

  getWillBeReferencedContent(chip: ChipsItem, metadata: string) {
    if (!this.hasWillBeReferenced(chip, metadata)) {
      return null;
    }
    const metadataValue = chip.item[metadata];
    return metadataValue?.authority?.substring(metadataValue?.authority.indexOf('::') + 2);
  }

  toolTipVisibleCheck(text: string): boolean {
    return text.length > TOOLTIP_TEXT_LIMIT;
  }

  textTruncate(text: string): string {
    if (text && text.length >= TOOLTIP_TEXT_LIMIT) {
      return `${text.substring(0, TOOLTIP_TEXT_LIMIT)}...`;
    }
    return text;
  }

}
