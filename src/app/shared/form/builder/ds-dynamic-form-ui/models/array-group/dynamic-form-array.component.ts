import { Component, EventEmitter, Input, NgZone, Output, QueryList, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent, DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlCustomEvent, DynamicFormControlEvent,
  DynamicFormLayout,
  DynamicFormLayoutService, DynamicFormService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Relationship } from '../../../../../../core/shared/item-relationships/relationship.model';
import { Reorderable, ReorderableRelationship } from '../../existing-metadata-list-element/existing-metadata-list-element.component';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { getSucceededRemoteData } from '../../../../../../core/shared/operators';
import { RelationshipService } from '../../../../../../core/data/relationship.service';

@Component({
  selector: 'ds-dynamic-form-array',
  templateUrl: './dynamic-form-array.component.html'
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent {

  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();

  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected relationshipService: RelationshipService,
              protected zone: NgZone,
              protected formService: DynamicFormService
  ) {
    super(layoutService, validationService);
  }

  moveSelection(event: CdkDragDrop<Relationship>) {
    this.zone.runOutsideAngular(() => {
      this.model.moveGroup(event.previousIndex,event.currentIndex - event.previousIndex);
      this.model.groups.forEach(
        (group: DynamicFormArrayGroupModel) => {
          console.log(group.group[0]);
        }
      )
      // return observableCombineLatest(reorderables.map((rel: ReorderableRelationship) => {
      //     if (rel.oldIndex !== rel.newIndex) {
      //       return this.relationshipService.updatePlace(rel);
      //     } else {
      //       return observableOf(undefined);
      //     }
      //   })
      // ).pipe(getSucceededRemoteData()).subscribe();
    })
  }

}
