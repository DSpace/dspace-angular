import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ListableObject } from './listable-object.model';
import { SelectableListService } from '../../object-list/selectable-list/selectable-list.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-selectable-list-item-control',
  // styleUrls: ['./selectable-list-item-control.component.scss'],
  templateUrl: './selectable-list-item-control.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
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
  constructor(private selectionService: SelectableListService) {
  }

  /**
   * Setup the dynamic child component
   */
  ngOnInit(): void {
    this.selected$ = this.selectionService?.isObjectSelected(this.selectionConfig.listId, this.object);
    this.selected$.subscribe((selected: ListableObject) => {

    })
  }

  selectCheckbox(value: boolean, object: ListableObject) {
    if (value) {
      this.selectionService.selectSingle(this.selectionConfig.listId, object);
      this.selectObject.emit(object);
    } else {
      this.selectionService.deselectSingle(this.selectionConfig.listId, object);
      this.deselectObject.emit(object);
    }
  }

  selectRadio(value: boolean, object: ListableObject) {
    const selected$ = this.selectionService.getSelectableList(this.selectionConfig.listId);
    selected$.pipe(
      take(1),
      map((selected) => selected ? selected.selection : [])
    ).subscribe((selection) => {
      // First deselect any existing selections, this is a radio button
      selection.forEach((selectedObject) => {
        this.selectionService.deselectSingle(this.selectionConfig.listId, selectedObject);
        this.deselectObject.emit(selectedObject);
      });
      if (value) {
        this.selectionService.selectSingle(this.selectionConfig.listId, object);
        this.selectObject.emit(object);
      }
    });
  }
}
