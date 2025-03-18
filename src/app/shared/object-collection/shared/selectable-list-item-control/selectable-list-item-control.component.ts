import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  skip,
  take,
} from 'rxjs/operators';

import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { VarDirective } from '../../../utils/var.directive';
import { ListableObject } from '../listable-object.model';

@Component({
  selector: 'ds-selectable-list-item-control',
  // styleUrls: ['./selectable-list-item-control.component.scss'],
  templateUrl: './selectable-list-item-control.component.html',
  standalone: true,
  imports: [VarDirective, NgIf, FormsModule, AsyncPipe, TranslateModule],
})
/**
 * Component for rendering list item that has a control (checkbox or radio button) because it's selectable
 */
export class SelectableListItemControlComponent implements OnInit {
  /**
   * The item or metadata to determine the component for
   */
  @Input() object: ListableObject;

  @Input() selectionConfig: { repeatable: boolean, listId: string };

  /**
   * Index of the control in the list
   */
  @Input() index: number;

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  selected$: Observable<boolean>;

  constructor(public selectionService: SelectableListService) {
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    this.selected$ = this.selectionService.isObjectSelected(this.selectionConfig.listId, this.object);
    this.selected$
      .pipe(skip(1)).subscribe((selected: boolean) => {
        if (selected) {
          this.selectObject.emit(this.object);
        } else {
          this.deselectObject.emit(this.object);
        }
      });
  }

  selectCheckbox(value: boolean) {
    if (value) {
      this.selectionService.selectSingle(this.selectionConfig.listId, this.object);
    } else {
      this.selectionService.deselectSingle(this.selectionConfig.listId, this.object);
    }
  }

  selectRadio(value: boolean) {
    if (value) {
      const selected$ = this.selectionService.getSelectableList(this.selectionConfig.listId);
      selected$.pipe(
        take(1),
        map((selected) => selected ? selected.selection : []),
      ).subscribe((selection) => {
        // First deselect any existing selections, this is a radio button
        selection.forEach((selectedObject) => {
          this.selectionService.deselectSingle(this.selectionConfig.listId, selectedObject);
          this.deselectObject.emit(selectedObject);
        });
        this.selectionService.selectSingle(this.selectionConfig.listId, this.object);
        this.selectObject.emit(this.object);
      },
      );
    }
  }
}
